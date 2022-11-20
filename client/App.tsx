import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import gavelImg from './static/gavel.png';
import MainPage from './MainPage';
import { Guild, User } from './types';


export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[] | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get<{ user: User, guilds: Guild[] }>('/app/user')
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
        <h1>
          <img src={gavelImg} alt='PUNISHED' />
          <span>PUNISHED</span>
        </h1>
      </header>

      {loading ? <p>Loading...</p> : (
        !user || !guilds ? <p><a href='/auth/login'>Log in with <strong>Discord</strong></a></p> : (
          <MainPage user={user} guilds={guilds} />
        )
      )}
    </div>
  );
}
