import axios from 'axios';


const botToken = process.env.DISCORD_BOT_TOKEN || '';

const api = axios.create({
  baseURL: 'https://discord.com/api/v10',
  headers: { Authorization: `Bot ${botToken}` },
});

export default api;
