import express, { Request, Response, NextFunction } from 'express';
import mongodbStore from 'connect-mongodb-session';
import morgan from 'morgan';
import session from 'express-session';

import client from './client';
import routes from './routes';


const { MONGODB_URI, PORT, SESSION_SECRET } = process.env;

const app = express();
app.use(morgan('dev'));

const MongoDBStore = mongodbStore(session);
const store = new MongoDBStore({
  uri: MONGODB_URI || '',
  collection: 'sessions',
});
store.on('error', (err: any) => console.error('Error in MongoDB store:', err));
app.use(session({
  secret: SESSION_SECRET || 'session-secret-666',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: true,
  },
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use('/', routes);
app.use('/', client);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).send(err.message);
});

const port = PORT || 3001;
app.listen(port, () => console.log('Listening on port', port));
