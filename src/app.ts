import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';

import user from './components/user';
import group from './components/group';
import auth from './components/auth';
import { errorMiddleware } from './shared/error';
import { loggerMiddlewares } from './shared/logger';
import { authMiddleware } from './shared/auth';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(...loggerMiddlewares);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(yamljs.load('./api-docs.yaml'))
);
app.use('/auth', auth);
app.use('/user', authMiddleware, user);
app.use('/group', authMiddleware, group);

app.use(errorMiddleware);

export default app;
