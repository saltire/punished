import './GuildConfig.scss';
import { Guild } from './types';


type GuildConfigProps = {
  guild: Guild,
  onCancel: () => void,
};

export default function GuildConfig({ guild, onCancel }: GuildConfigProps) {
  return (
    <div className='GuildConfig'>
      <h2>
        {guild.icon && (
          <img
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
            alt={guild.name}
          />
        )}
        <strong>{guild.name}</strong>
      </h2>

      <p>Point types</p>
      {guild.pointTypes.map(pointType => pointType.namePlural)}

      <footer>
        <button
          type='button'
          onClick={onCancel}
        >
          Back
        </button>
      </footer>
    </div>
  );
}
