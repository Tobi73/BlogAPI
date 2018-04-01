import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import index from './controller';
import { initDatabase } from './repository/database';
import { LogicException } from './constants';
import { initAdmin } from './bll/user';

initDatabase();
initAdmin();

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(passport.initialize());
app.use(cors());
app.use('/', index);
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'dev') {
    console.error(err);
  }
  if (err instanceof LogicException) {
    res.status(err.status).end(err.msg);
  } else {
    res.status(503).end();
  }
});


export default app;

