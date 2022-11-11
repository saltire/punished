import './Guilds.scss';


type GuildsProps = {
  guilds: any[],
};

export default function Guilds({ guilds }: GuildsProps) {
  return (
    <div className='Guilds'>
      <p>Your servers</p>

      {guilds?.map((guild: any) => (
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
            >
              Config ⏵
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
