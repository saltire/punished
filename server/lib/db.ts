import { Db, Document, MongoClient } from 'mongodb';


const uri = process.env.MONGODB_URI || '';

let dbPromise: Promise<Db>;

const connectToDB = async () => {
  const client = await MongoClient
    .connect(uri)
    .catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });

  process.on('exit', () => {
    console.log('Closing MongoDB connection...');
    client.close(false);
  });

  const db = client.db();

  return db;
};

const db = () => {
  if (!dbPromise) {
    dbPromise = connectToDB();
  }
  return dbPromise;
};

const collection = async <T extends Document>(name: string) => (await db()).collection<T>(name);

// Point types

export type PointType = {
  guildId: string,
  id: string,
  namePlural: string,
  nameSingular: string,
  listTitle?: string,
};

export type BasePointType = Omit<PointType, 'guildId'>;

export const defaultPointTypes: BasePointType[] = [{
  id: 'demerit',
  namePlural: 'Demerit Points',
  nameSingular: 'Demerit Point',
  listTitle: 'Most Demerited Users',
}];
const defaultPointTypeIds = defaultPointTypes.map(pt => pt.id);

// Users

export type User = {
  guildId: string,
  userId: string,
  username: string,
  points: {
    [pointTypeId: string]: number,
  },
};

type ListResult = {
  [pointTypeId: string]: {
    userId: string,
    username: string,
    points: number,
  }[],
};

export const getList = async (
  guildId: string, pointTypeIds?: string[], limit?: number,
) => (await collection<User>('punishedusers'))
  .aggregate<ListResult>(
  [
    { $match: { guildId } },
    {
      $facet: Object.fromEntries((pointTypeIds?.length ? pointTypeIds : defaultPointTypeIds)
        .map(ptid => [ptid, [
          {
            $project: {
              userId: 1,
              username: 1,
              points: `$points.${ptid}`,
            },
          },
          { $match: { points: { $ne: 0 } } },
          { $sort: { points: -1 } },
          ...(limit && limit > 0) ? [{ $limit: limit }] : [],
        ]])),
    },
  ])
  .toArray();

export const getUserScore = async (
  guildId: string, userId: string,
) => (await collection<User>('punishedusers'))
  .findOne({ guildId, userId });

export const updateUserPoints = async (
  guildId: string, userId: string, username: string, pointTypeId: string, number: number,
  replace?: boolean,
) => (await collection<User>('punishedusers'))
  .findOneAndUpdate(
    {
      guildId,
      userId,
    },
    {
      $set: {
        guildId,
        userId,
        username,
        ...replace ? { [`points.${pointTypeId}`]: number } : {},
      },
      ...!replace ? { $inc: { [`points.${pointTypeId}`]: number } } : {},
    },
    {
      returnDocument: 'after',
      upsert: true,
    })
  .then(({ value }) => value);

// Sessions

export type UserSession = {
  sessionID: string,
  accessToken: string,
  expiresAt: Date,
  refreshToken: string,
  scope: string,
  tokenType: string,
};

export const getUserSession = async (
  sessionID: string,
) => (await collection<UserSession>('usersessions'))
  .findOne({ sessionID });

export const saveUserSession = async (
  oauthSession: UserSession,
) => (await collection<UserSession>('usersessions'))
  .findOneAndUpdate(
    { sessionID: oauthSession.sessionID },
    { $set: oauthSession },
    {
      returnDocument: 'after',
      upsert: true,
    })
  .then(({ value }) => value);
