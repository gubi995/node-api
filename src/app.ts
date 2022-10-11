import express from 'express';
import bodyParser from 'body-parser';

import user from './components/user';
import { errorMiddleware } from './utils/error';
import { loggerMiddleware } from './utils/logger';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(loggerMiddleware);

app.use('/user', user);

app.use(errorMiddleware);

export default app;
