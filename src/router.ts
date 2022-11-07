import { verifyKeyMiddleware } from 'discord-interactions';
import Router from 'express-promise-router';

import api from './api';
import buildCommands from './commands';
import { defaultPointTypes } from './db';
import handleInteraction from './interactions';


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
