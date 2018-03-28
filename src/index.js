import http from 'http';
import app from './app';

const server = http.Server(app);
const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log(`App is running on ${port}`);
});
