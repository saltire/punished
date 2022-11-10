import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';


export default function App() {
  const [loading, setLoading] = useState(false);
  const [guild, setGuild] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    axios.get<{ guild: any }>('/guild')
      .then(({ data }) => setGuild(data.guild))
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
          guild ? (
            <>
              <p>Logged in server: <strong>{guild.name}</strong></p>

              <p><a href='/connect'>Connect another server</a></p>
              <p><a href='/logout'>Log out</a></p>
            </>
          ) : (
            <p><a href='/connect'>Connect your server</a></p>
          )
        )}
      </main>
    </div>
  );
}
