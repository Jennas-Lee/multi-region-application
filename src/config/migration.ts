import { userFactory } from '../model/user';
import { logger } from './logger';

export const migrate = async () => {
  await userFactory().sync()
    .then(() => {
      logger.info('Migrate User table successful.');
    })
    .catch((error) => {
      logger.error('Migrate User table failed.\n' + error);
    });
}
