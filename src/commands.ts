import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionFlagsBits,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
} from 'discord-api-types/v10';

import api from './api';
import { BasePointType } from './db';
import { exists } from './utils';


const appId = process.env.DISCORD_APP_ID || '';

export const getAppCommands = async () => api.get(`/applications/${appId}/commands`)
  .then(resp => resp.data);

const buildCommands = (pointTypes: BasePointType[]): Command[] => [
  {
    type: ApplicationCommandType.ChatInput,
    name: 'list',
    description: 'List current totals for all users',
    options: [
      pointTypes.length > 1 ? {
        type: ApplicationCommandOptionType.String,
        name: 'type',
        description: 'The type of points to display. Leave out to display all.',
        choices: pointTypes.map(pointType => ({
          name: pointType.namePlural,
          value: pointType.id,
        })),
      } : null,
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'max',
        description: 'Maximum number of top users to display. Leave out to display all.',
      },
    ].filter(exists) as APIApplicationCommandOption[],
  },
  {
    name: 'give',
    type: ApplicationCommandType.ChatInput,
    description: 'Give points to a user',
    default_member_permissions: (PermissionFlagsBits.Administrator).toString(16),
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'The user to give points to.',
        required: true,
      },
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'number',
        description: 'The number of points to give. Can be positive or negative.',
        required: true,
      },
      pointTypes.length > 1 ? {
        type: ApplicationCommandOptionType.String,
        name: 'type',
        description: 'The type of points to give.',
        required: true,
        choices: pointTypes.map(pointType => ({
          name: pointType.namePlural,
          value: pointType.id,
        })),
      } : null,
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'A reason for giving points to this user, to display in the message.',
      },
    ].filter(exists) as APIApplicationCommandOption[],
  },
  {
    name: 'set',
    type: ApplicationCommandType.ChatInput,
    description: 'Set the number of points for a user',
    default_member_permissions: (PermissionFlagsBits.Administrator).toString(16),
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'The user to set points for.',
        required: true,
      },
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'number',
        description: 'The number of points to set to.',
        required: true,
      },
      pointTypes.length > 1 ? {
        type: ApplicationCommandOptionType.String,
        name: 'type',
        description: 'The type of points to set.',
        required: true,
        choices: pointTypes.map(pointType => ({
          name: pointType.namePlural,
          value: pointType.id,
        })),
      } : null,
      {
        type: ApplicationCommandOptionType.String,
        name: 'reason',
        description: 'A reason for setting points on this user, to display in the message.',
      },
    ].filter(exists) as APIApplicationCommandOption[],
  },
];

export default buildCommands;
