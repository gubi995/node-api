import express from 'express';

import user from './components/user';
import { errorMiddleware } from './utils/error';
import { loggerMiddleware } from './utils/logger';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(loggerMiddleware);

app.use('/user', user);

app.use(errorMiddleware);

export default app;
