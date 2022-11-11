import './Guilds.scss';
import { Guild } from './types';


type GuildsProps = {
  guilds: Guild[],
  setConfigGuild: (guild: Guild) => void,
};

export default function Guilds({ guilds, setConfigGuild }: GuildsProps) {
  return (
    <div className='Guilds'>
      <h2>Your servers</h2>

      {guilds?.map(guild => (
        <div key={guild.id}>
          {guild.icon && (
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt={guild.name}
            />
          )}
          <strong>{guild.name}</strong>

          <div className={`buttons${guild.hasBot ? ' with-bot' : ''}`}>
            <button
              type='button'
              onClick={() => {
                window.location.href = `/auth/bot?guildId=${guild.id}`;
              }}
            >
              {guild.hasBot ? 'Bot added!' : 'Add bot'}
            </button>

            <button
              type='button'
              className='green'
              onClick={() => setConfigGuild(guild)}
            >
              Config ⏵
            </button>
          </div>
        </div>
      ))}

      {}
    </div>
  );
}
