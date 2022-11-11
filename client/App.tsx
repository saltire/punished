import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import gavelImg from './static/gavel.png';
import MainPage from './MainPage';


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
        <h1>
          <img src={gavelImg} alt='PUNISHED' />
          <span>PUNISHED</span>
        </h1>
      </header>

      {loading ? <p>Loading...</p> : (
        !user ? <p><a href='/auth/login'>Log in with <strong>Discord</strong></a></p> : (
          <MainPage user={user} guilds={guilds} />
        )
      )}
    </div>
  );
}
