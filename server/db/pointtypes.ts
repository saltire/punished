import { getCollection } from './client';


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
export const defaultPointTypeIds = defaultPointTypes.map(pt => pt.id);

const collection = () => getCollection<PointType>('pointtypes');

export const getPointTypes = async (guildId: string) => (await collection())
  .find({ guildId })
  .toArray();

export const savePointType = async (pointType: PointType) => (await collection())
  .findOneAndUpdate(
    {
      guildId: pointType.guildId,
      id: pointType.id,
    },
    { $set: pointType },
    {
      returnDocument: 'after',
      upsert: true,
    })
  .then(({ value }) => value);
