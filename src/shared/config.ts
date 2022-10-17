import convict from 'convict';

interface ConfigSchema {
  env: string;
  port: number;
  db: string;
}

const config = convict<ConfigSchema>({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    doc: 'Connection URL to the db',
    format: '*',
    default: 'postgres://username:password@url:port/dbName ',
  },
});

const env = config.get('env');

config.loadFile(`./config/${env}.json`);

config.validate({ allowed: 'strict' });

console.log({ config });

export default config;
