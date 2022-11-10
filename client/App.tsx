import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';


export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guilds, setGuilds] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    axios.get<{ user: any, guilds: any[] }>('/user')
      .then(({ data }) => {
        setUser(data.user);
        setGuilds(data.guilds);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='App'>
      <header>
        <h1>PUNISHED</h1>
      </header>
      <main>
        {loading ? <p>Loading...</p> : (
          user ? (
            <>
              <p>Logged in user: <strong>{user.username}</strong></p>

              <p>
                User’s guilds:
                {guilds?.map((guild: any) => (
                  <span key={guild.id}><br /><strong>{guild.name}</strong></span>
                ))}
              </p>

              <p><a href='/auth/logout'>Log out</a></p>
            </>
          ) : (
            <p><a href='/auth/login'>Log in</a></p>
          )
        )}
      </main>
    </div>
  );
}
