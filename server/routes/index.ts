import { APIGuild, APIUser } from 'discord-api-types/v10';
import { verifyKeyMiddleware } from 'discord-interactions';
import Router from 'express-promise-router';

import { defaultPointTypes, getPointTypes } from '../db/pointtypes';
import { getUserSession } from '../db/usersessions';
import callApi from '../lib/api';
import buildCommands from '../lib/commands';
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
  res.json(await callApi(`/applications/${appId}/commands`));
});

router.get('/commands/update', async (req, res) => {
  const commands = buildCommands(defaultPointTypes);
  res.json(await callApi(`/applications/${appId}/commands`, { method: 'put', body: commands }));
});

// App data

router.get('/user', async (req, res) => {
  const userSession = await getUserSession(req.sessionID);

  if (!userSession || userSession.expiresAt.valueOf() - Date.now() < 30) {
    res.json();
    return;
  }

  const [user, guilds] = await Promise.all([
    callApi<APIUser>('users/@me', { token: userSession.accessToken }),
    callApi<APIGuild[]>('users/@me/guilds', { token: userSession.accessToken })
      .then(userGuilds => Promise.all(userGuilds
        .filter(guild => (Number(guild.permissions) & 0x20) === 0x20)
        .map(async guild => {
          const [pointTypes, hasBot] = await Promise.all([
            getPointTypes(guild.id),
            // Try to access the guild with the bot token, and mark if successful.
            callApi(`guilds/${guild.id}`)
              .then(() => true)
              .catch(() => false),
          ]);

          return { ...guild, pointTypes, hasBot };
        }))),
  ]);

  res.json({ user, guilds });
});

// OAuth

router.use('/auth', auth);
