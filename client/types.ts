import { APIGuild, APIUser } from 'discord-api-types/v10';


export type PointType = {
  guildId: string,
  id: string,
  namePlural: string,
  nameSingular: string,
  listTitle?: string,
};

export type Guild = APIGuild & {
  hasBot: boolean,
  pointTypes: PointType[],
};

export type User = APIUser;
