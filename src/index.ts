import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import router from './router';


const app = express();
app.use(morgan('dev'));

app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.sendStatus(500);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port', port);
});
