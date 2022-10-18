import convict from 'convict';

interface ConfigSchema {
  env: string;
  port: number;
  db: {
    name: string;
    dialect: string;
    username: string;
    password: string;
  };
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
    name: {
      doc: 'Name of the DB',
      format: '*',
      default: 'dbname',
    },
    dialect: {
      doc: 'Dialect of the DB (e.g. sqlite, postgres, mysql)',
      format: '*',
      default: 'postgres',
    },
    username: {
      doc: 'Username credential',
      format: '*',
      default: 'username',
    },
    password: {
      doc: 'Password credential',
      format: '*',
      default: 'password',
    },
  },
});

const env = config.get('env');

config.loadFile(`./config/${env}.json`);

config.validate({ allowed: 'strict' });

export default config;
