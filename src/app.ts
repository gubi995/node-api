import express from 'express';

import user from './components/user';
import group from './components/group';
import { errorMiddleware } from './shared/error';
import { loggerMiddleware } from './shared/logger';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(loggerMiddleware);

app.use('/user', user);
app.use('/group', group);

app.use(errorMiddleware);

export default app;
