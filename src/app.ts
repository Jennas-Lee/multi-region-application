import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import { logger, stream } from './config/logger';
import { sequelize } from './model';
import { migrate } from './config/migration';

import apiController from './router/controller/api/apiController';

interface ErrorWithStatus extends Error {
  status: number;
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const app: express.Application = express();

app.set('port', process.env.EXPRESS_PORT || 3001);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(
  'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms',
  {
    stream: stream,
    skip: (req: Request, res: Response) => {
      return req.url === '/health';
    }
  })
);

app.use('/', apiController);

app.use((req: Request, res: Response, next: NextFunction) => {
  let err = new Error() as ErrorWithStatus;
  err.status = 404;
  next(err)
});

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  res.locals.error = NODE_ENV === 'development' ? err : {};
  res.status(err.status || 500).send();
  next();
});

export let server = app.listen(app.get('port'),  async () => {
  logger.info(`Server is started at PORT ${app.get('port')}.`);

  await sequelize.authenticate()
    .then(async () => {
      logger.info('Database is connected successful.');
      await migrate();
    })
    .catch((error: any) => {
      logger.error('Connection is failed to database.\n' + error);
      server.close();
    });
});
