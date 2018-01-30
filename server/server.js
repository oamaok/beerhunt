import http from 'http';
import Koa from 'koa';

const app = new Koa();
const server = http.createServer(app.callback());

if (require.main === module) {
  server.listen(3000);
}

export default server;