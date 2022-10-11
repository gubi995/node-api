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
    'just-error': {
      type: 'logLevelFilter',
      appender: 'error',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: ['out', 'app', 'just-error'],
      level: 'debug',
    },
  },
  //   pm2: true, Loggers probably won't work according the doc. Let's look into it later
});

class Logger {
  #logger = log4js.getLogger();

  debug(message: string) {
    this.#logger.debug(message);
  }

  info(message: string) {
    this.#logger.info(message);
  }

  warn(message: string) {
    this.#logger.warn(message);
  }

  error(message: string) {
    this.#logger.error(message);
  }

  fatal(message: string) {
    this.#logger.fatal(message);
  }
}

const logger = new Logger();

export default logger;

export const loggerMiddleware = log4js.connectLogger(log4js.getLogger(), {
  level: 'info',
});
