import './MainPage.scss';


type MainPageProps = {
  user: any,
  guilds: any[],
};

export default function MainPage({ user, guilds }: MainPageProps) {
  return (
    <main className='MainPage'>
      {!user ? (
        <p><a href='/auth/login'>Log in</a></p>
      ) : (
        <>
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

          <p>Your servers</p>

          <div className='guilds'>
            {guilds?.map((guild: any) => (
              <div key={guild.id}>
                {guild.icon && (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                  />
                )}
                <strong>{guild.name}</strong>

                <div className='buttons'>
                  <button
                    type='button'
                    className={guild.hasBot ? 'with-bot' : undefined}
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
        </>
      )}
    </main>
  );
}
