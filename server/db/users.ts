import { getCollection } from './client';
import { defaultPointTypeIds } from './pointtypes';


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

const collection = () => getCollection<User>('punishedusers');

export const getList = async (
  guildId: string, pointTypeIds?: string[], limit?: number,
) => (await collection())
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

export const getUserScore = async (guildId: string, userId: string) => (await collection())
  .findOne({ guildId, userId });

export const updateUserPoints = async (
  guildId: string, userId: string, username: string, pointTypeId: string, number: number,
  replace?: boolean,
) => (await collection())
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
