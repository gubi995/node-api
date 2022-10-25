import fs from 'fs';
import rTracer from 'cls-rtracer';
import pino, { multistream } from 'pino';
import pinoHttp from 'pino-http';

const streams = multistream([
  {
    stream: process.stdout,
  },
  {
    stream: process.stdout,
    level: 'error',
  },
  {
    stream: fs.createWriteStream('logs/app.log'),
  },
  {
    stream: fs.createWriteStream('logs/app.log'),
    level: 'error',
  },
]);

const pinoLogger = pino(
  {
    level: 'debug',
    mixin() {
      return { requestId: rTracer.id() };
    },
  },
  streams
);

class Logger {
  #logger = pinoLogger;

  withMetadata(metadata: object) {
    return this.#logger.child(metadata);
  }

  debug(message: string, context: object = {}) {
    this.#logger.debug(context, message);
  }

  info(message: string, context: object = {}) {
    this.#logger.info(context, message);
  }

  warn(message: string, context: object = {}) {
    this.#logger.warn(context, message);
  }

  error(message: string, context: object = {}) {
    this.#logger.error(context, message);
  }
}

const logger = new Logger();

export default logger;

export const loggerMiddlewares = [
  rTracer.expressMiddleware({
    echoHeader: true,
    useHeader: true,
    headerName: 'X-Transaction-Id',
  }),
  pinoHttp({ logger: pinoLogger }),
];
