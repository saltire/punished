import { APIGuild, APIUser } from 'discord-api-types/v10';
import Router from 'express-promise-router';

import { getPointTypes } from '../db/pointtypes';
import { getUserSession } from '../db/usersessions';
import callApi from '../lib/discordApi';


const router = Router();
export default router;

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
