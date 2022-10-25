import express from 'express';

import user from './components/user';
import group from './components/group';
import { errorMiddleware } from './shared/error';
import { loggerMiddlewares } from './shared/logger';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(...loggerMiddlewares);

app.use('/user', user);
app.use('/group', group);

app.use(errorMiddleware);

export default app;
