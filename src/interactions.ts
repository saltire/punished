import {
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIInteractionResponseChannelMessageWithSource,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';

import api from './api';
import { defaultPointTypes, getList, updateUserPoints } from './db';


const getOptionValue = (options: any, name: string) => options
  ?.find((o: any) => o.name === name)?.value;

const messageResponse = (data: APIInteractionResponseCallbackData):
APIInteractionResponseChannelMessageWithSource => ({
  type: InteractionResponseType.ChannelMessageWithSource,
  data,
});

const handleInteraction = async (type: InteractionType, guildId: string, data: any):
Promise<APIInteractionResponse | null> => {
  if (type === InteractionType.Ping) {
    return { type: InteractionResponseType.Pong };
  }

  if (type === InteractionType.ApplicationCommand) {
    const { name, options } = data;

    if (name === 'list') {
      const limit = getOptionValue(options, 'max');

      const results = (await getList(guildId, [], limit)).pop();
      if (!results) {
        return messageResponse({ content: 'Sorry, I couldn‘t find anything. Try again?' });
      }
      const pointTypeLists = Object.entries(results)
        .filter(([, pointTypeResults]) => pointTypeResults?.length)
        .map(([pointTypeId, pointTypeResults]) => ({ pointTypeId, pointTypeResults }));

      if (!pointTypeLists.length) {
        return messageResponse({ content: 'Sorry, I couldn‘t find anything. Try again?' });
      }

      const pointTypes = defaultPointTypes;

      return messageResponse({
        embeds: pointTypeLists.map(({ pointTypeId, pointTypeResults }) => ({
          title: pointTypes.find(pt => pt.id === pointTypeId)?.listTitle,
          // fields: pointTypeResults.map(user => ({
          //   name: `${user.username}`,
          //   value: `${user.points}`,
          // })),
          description: pointTypeResults.map(user => `${user.username} · **${user.points}**`)
            .join('\n'),
        })),
      });
    }

    if (['give', 'set'].includes(name)) {
      const userId = getOptionValue(options, 'user');
      const number = getOptionValue(options, 'number');
      const reason = getOptionValue(options, 'reason');
      const pointTypeId = defaultPointTypes[0].id;
      const replace = name === 'set';

      const member = userId && await api.get(`/guilds/${guildId}/members/${userId}`)
        .then(resp => resp.data);

      const pointType = defaultPointTypes[0];

      if (!member || number === undefined) {
        return messageResponse({ content: 'Sorry, didn’t understand that. Try again?' });
      }

      const username = member.nick || member.user.username;

      const user = await updateUserPoints(
        guildId, userId, username, pointTypeId, number, replace);
      if (!user) {
        return messageResponse({ content: 'Sorry, I wasn’t able to update the user. Try again?' });
      }

      const ptName = Math.abs(number) === 1 ? pointType.nameSingular : pointType.namePlural;
      const reasonText = reason ? ` *(${reason})*` : '';

      return messageResponse({
        content: replace
          ? `<@${userId}>, your ${pointType.namePlural} have been set to **${number}**${reasonText}.`
          : [
            `<@${userId}>, you have been given **${number}** ${ptName}${reasonText}.`,
            `Your total ${pointType.namePlural} are now **${user.points[pointTypeId] || 0}**.`,
          ].join(' '),
      });
    }
  }

  return null;
};

export default handleInteraction;
