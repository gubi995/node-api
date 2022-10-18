import log4js from 'log4js';
import path from 'path';

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: path.join('logs', 'app.log') },
    error: {
      type: 'file',
      filename: path.join('logs', 'error.log'),
    },
    onlyError: {
      type: 'logLevelFilter',
      appender: 'error',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: ['out', 'app', 'onlyError'],
      level: 'debug',
      enableCallStack: true,
    },
  },
  //   pm2: true, Loggers probably won't work according the doc. Let's look into it later
});

type Log = string | Error;

class Logger {
  #logger = log4js.getLogger();

  debug(message: Log, ...details: Log[]) {
    this.#logger.debug(message, ...details);
  }

  info(message: Log, ...details: Log[]) {
    this.#logger.info(message, ...details);
  }

  warn(message: Log, ...details: Log[]) {
    this.#logger.warn(message, ...details);
  }

  error(message: Log, ...details: Log[]) {
    this.#logger.error(message, ...details);
  }
}

const logger = new Logger();

export default logger;

export const loggerMiddleware = log4js.connectLogger(log4js.getLogger(), {
  level: 'info',
});
