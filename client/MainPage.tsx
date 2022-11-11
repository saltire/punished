import { useState } from 'react';

import './MainPage.scss';
import GuildConfig from './GuildConfig';
import Guilds from './Guilds';
import { Guild, User } from './types';


type MainPageProps = {
  user: User,
  guilds: Guild[],
};

export default function MainPage({ user, guilds }: MainPageProps) {
  const [configGuild, setConfigGuild] = useState<Guild | null>(null);

  return (
    <main className='MainPage'>
      <header className='user-header'>
        <span>Logged in as: </span>
        {user.avatar && (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            alt={user.username}
          />
        )}
        <span className='user-name'>{user.username}</span>
        <a href='/auth/logout'>Log out</a>
      </header>

      {configGuild
        ? <GuildConfig guild={configGuild} onCancel={() => setConfigGuild(null)} />
        : <Guilds guilds={guilds} setConfigGuild={setConfigGuild} />}
    </main>
  );
}
