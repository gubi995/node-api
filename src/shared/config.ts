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
  auth: {
    jwtSecret: string;
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
  auth: {
    jwtSecret: {
      doc: 'JWT token secret',
      format: '*',
      default:
        '9c5ef3458dc96f90dc14aea2c435265ff7818f59600b54b6652037437f5a8f1049b9054cbaf89547f025a0dc9468a29f1440d71268d0c1d02aedcb630ffc8a0e',
    },
  },
});

const env = config.get('env');

config.loadFile(`./config/${env}.json`);

config.validate({ allowed: 'strict' });

export default config;
