import config from 'config3';
import mongoose from 'mongoose';

const exit = (msg) => {
  console.log(msg);
  process.exit(1);
};

export const initDatabase = () => {
  const database = mongoose.connection;
  mongoose.Promise = Promise;
  mongoose.connect(config.database[process.env.NODE_ENV || 'dev'], {
    useMongoClient: true,
    promiseLibrary: global.Promise,
  });
  database.on('error', error => exit(`Connection to database failed: ${error}`));
  database.on('disconnected', () => exit('Disconnected from database'));
  process.on('SIGINT', () => {
    database.close(() => {
      process.exit(0);
    });
  });
};

