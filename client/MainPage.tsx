import './MainPage.scss';
import Guilds from './Guilds';


type MainPageProps = {
  user: any,
  guilds: any[],
};

export default function MainPage({ user, guilds }: MainPageProps) {
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

      <Guilds guilds={guilds} />
    </main>
  );
}
