import http from 'http';
import Koa from 'koa';
import koaJson from 'koa-json';
import koaBodyparser from 'koa-bodyparser';

import config from './config';
import { initializeDatabase } from './database';
import createRouter from './router';

const app = new Koa();
const server = http.createServer(app.callback());

(async () => {
  app.use(koaBodyparser());
  const db = await initializeDatabase();

  const router = createRouter(db);

  app.use(router.routes());
  app.use(koaJson());
})();

if (require.main === module) {
  server.listen(config.apiPort);
}

export default server;
