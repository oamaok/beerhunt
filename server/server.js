import http from 'http';
import Koa from 'koa';
import koaJson from 'koa-json';
import Router from 'koa-router';
import koaBodyparser from 'koa-bodyparser';
import config from './config';

import { getData, addRecord } from './database';

import bars from './data/bars.json';
import types from './data/types.json';

const app = new Koa();
const server = http.createServer(app.callback());
app.use(koaBodyparser());
const router = new Router({
  prefix: '/api',
});


router
  .get('/bars', (ctx) => {
    ctx.body = bars;
  })
  .get('/types', (ctx) => {
    ctx.body = types;
  })
  .get('/beers', (ctx) => {
    ctx.body = getData();
  })
  .post('/beer', (ctx) => {
    const {
      bar,
      beerType,
      name,
      volume,
      abv,
      facebookId,
    } = ctx.request.body;

    addRecord({
      name,
      bar,
      beerType,
      volume,
      abv,
      facebookId,
      time: (new Date()).getTime(),
    });

    ctx.body = { ok: true };
  });

app.use(router.routes());
app.use(koaJson());

if (require.main === module) {
  server.listen(config.apiPort);
}

export default server;
