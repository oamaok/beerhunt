import http from 'http';
import Koa from 'koa';
import koaJson from 'koa-json';
import Router from 'koa-router';
import koaBodyparser from 'koa-bodyparser';
import request from 'request-promise-native';
import jwt from 'jsonwebtoken';

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

function getDataFromToken(token, key) {
  try {
    return jwt.verify(token, key);
  } catch (err) {
    return null;
  }
}

const JWT_SECRET = process.env.EBH_JWT_SECRET || 'ebh_secret';
const DAY_IN_SECONDS = 60 * 60 * 24;

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
      volume,
      abv,
      token,
    } = ctx.request.body;

    const userData = getDataFromToken(token, JWT_SECRET);

    if (!userData) {
      ctx.body = { status: 'error' };
      return;
    }

    const { id, name } = userData.data;

    addRecord({
      name,
      bar,
      beerType,
      volume,
      abv,
      id,
      time: (new Date()).getTime(),
    });

    ctx.body = { status: 'success' };
  })
  .post('/auth', async (ctx) => {
    const rawResponse = await request.get(`https://graph.facebook.com/me?access_token=${ctx.request.body.accessToken}`);
    const response = JSON.parse(rawResponse);

    if (response.error) {
      ctx.body = { status: 'error' };
      return;
    }

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + DAY_IN_SECONDS,
      data: {
        id: response.id,
        name: response.name,
      },
    }, JWT_SECRET);

    ctx.body = {
      status: 'success',
      token,
    };
  });
app.use(router.routes());
app.use(koaJson());

if (require.main === module) {
  server.listen(config.apiPort);
}

export default server;
