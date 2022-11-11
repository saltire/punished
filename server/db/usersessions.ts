import { getCollection } from './client';


export type UserSession = {
  sessionID: string,
  accessToken: string,
  expiresAt: Date,
  refreshToken: string,
  scope: string,
  tokenType: string,
};

const collection = () => getCollection<UserSession>('usersessions');

export const getUserSession = async (sessionID: string) => (await collection())
  .findOne({ sessionID });

export const saveUserSession = async (oauthSession: UserSession) => (await collection())
  .findOneAndUpdate(
    { sessionID: oauthSession.sessionID },
    { $set: oauthSession },
    {
      returnDocument: 'after',
      upsert: true,
    })
  .then(({ value }) => value);
