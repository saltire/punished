import { verifyKeyMiddleware } from 'discord-interactions';
import Router from 'express-promise-router';

import api from '../lib/api';
import buildCommands from '../lib/commands';
import { defaultPointTypes, getOAuthSession } from '../lib/db';
import handleInteraction from '../lib/interactions';

import auth from './auth';


const appId = process.env.DISCORD_APP_ID || '';
const publicKey = process.env.DISCORD_PUBLIC_KEY || '';

const router = Router();
export default router;

router.post('/interactions', verifyKeyMiddleware(publicKey), async (req, res) => {
  console.dir(req.body, { depth: null });
  const { type, guild_id: guildId, data } = req.body;

  const response = await handleInteraction(type, guildId, data);
  console.dir(response, { depth: null });

  res.json(response);
});

// Commands

router.get('/commands', async (req, res) => {
  const { data } = await api.get(`/applications/${appId}/commands`);
  res.json(data);
});

router.get('/commands/update', async (req, res) => {
  const commands = buildCommands(defaultPointTypes);

  const { data } = await api.put(`/applications/${appId}/commands`, commands);

  res.json(data);
});

// App data

router.get('/guild', async (req, res) => {
  const oauthSession = await getOAuthSession(req.sessionID);

  if (!oauthSession || oauthSession.expiresAt.valueOf() - Date.now() < 30) {
    res.json({});
    return;
  }

  const { data: guild } = await api.get(`guilds/${oauthSession.guildId}`);

  res.json({ guild });
});

// OAuth

router.use('/auth', auth);
