import http from 'http';
import Koa from 'koa';
import koaJson from 'koa-json';

import config from './config';

const app = new Koa();
const server = http.createServer(app.callback());

app.use(koaJson());

if (require.main === module) {
  server.listen(config.apiPort);
}

export default server;