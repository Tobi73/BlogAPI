import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import index from './controller';
import db from './repository/database';

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use('/', index);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(503).end(err);
});


export default app;

