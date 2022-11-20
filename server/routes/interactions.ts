import { verifyKeyMiddleware } from 'discord-interactions';
import Router from 'express-promise-router';

import handleInteraction from '../lib/interactions';


const publicKey = process.env.DISCORD_PUBLIC_KEY || '';

const router = Router();
export default router;

router.post('/', verifyKeyMiddleware(publicKey), async (req, res) => {
  console.dir(req.body, { depth: null });
  const { type, guild_id: guildId, data } = req.body;

  const response = await handleInteraction(type, guildId, data);
  console.dir(response, { depth: null });

  res.json(response);
});
