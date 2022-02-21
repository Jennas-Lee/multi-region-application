import { createLogger, format, Logger, transports } from 'winston';
import moment from 'moment';
import fs from 'fs';

const { combine, printf } = format;

const timestamp = () => moment().format('YYYY-MM-DD HH:mm:ss');
const logDir = __dirname + "/../logs/";
const loggingFormat = printf(({ level, message}) => {
  return `${timestamp()} ${level} : ${message}`;
});

if(!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const infoTransport = new transports.Console({
  level: 'info',
});

const errorTransport = new transports.Console({
  level: 'error',
});

const fileTransport = new transports.File({
  level: 'info',
  filename: logDir + 'app.log',
});

const logger: Logger = createLogger({
  format: combine(
    loggingFormat
  ),
  transports: [
    fileTransport,
  ]
});

if(process.env.NODE_ENV !== 'production') {
  logger.add(infoTransport);
  logger.add(errorTransport);
}

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

export { logger, stream };