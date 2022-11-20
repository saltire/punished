import Router from 'express-promise-router';

import { defaultPointTypes } from '../db/pointtypes';
import callApi from '../lib/discordApi';
import buildCommands from '../lib/commands';


const appId = process.env.DISCORD_APP_ID || '';

const router = Router();
export default router;

router.get('/commands', async (req, res) => {
  res.json(await callApi(`/applications/${appId}/commands`));
});

router.get('/commands/update', async (req, res) => {
  const commands = buildCommands(defaultPointTypes);
  res.json(await callApi(`/applications/${appId}/commands`, { method: 'put', body: commands }));
});
