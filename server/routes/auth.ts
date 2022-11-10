import axios from 'axios';
import { createHash } from 'crypto';
import Router from 'express-promise-router';
import queryString from 'query-string';

import { saveUserSession } from '../lib/db';


const appId = process.env.DISCORD_APP_ID || '';
const clientSecret = process.env.DISCORD_CLIENT_SECRET || '';

const router = Router();
export default router;

const getSessionHash = (sessionID: string) => {
  const hash = createHash('sha256');
  hash.update(sessionID);
  return hash.digest('base64');
};

router.get('/login', async (req, res) => {
  req.session.touch();
  console.log('login', req.sessionID);
  const qs = queryString.stringify({
    response_type: 'code',
    client_id: appId,
    scope: [
      'guilds',
      'identify',
    ].join(' '),
    state: getSessionHash(req.sessionID),
    redirect_uri: `https://${req.headers.host}/auth/callback`,
  });

  res.redirect(`https://discord.com/oauth2/authorize?${qs}`);
});

router.get('/callback', async (req, res) => {
  console.log('callback', req.sessionID);
  if (req.query.state !== getSessionHash(req.sessionID)) {
    throw new Error('State does not match.');
  }

  const expiresAt = new Date();

  const { data } = await axios.post<{
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    guild: {
      id: string,
    },
  }>('https://discord.com/api/oauth2/token',
    queryString.stringify({
      client_id: appId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: `https://${req.headers.host}/auth/callback`,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in);

  await saveUserSession({
    sessionID: req.sessionID,
    accessToken: data.access_token,
    expiresAt,
    refreshToken: data.refresh_token,
    scope: data.scope,
    tokenType: data.token_type,
  });

  res.redirect('/');
});

router.get('/logout', async (req, res) => {
  req.session.regenerate(() => res.redirect('/'));
});
