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

const JWT_SECRET = process.env.EBH_JWT_SECRET || 'ebh_secret';
const DAY_IN_SECONDS = 60 * 60 * 24;

function getDataFromToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function createFreshToken(id, name) {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + DAY_IN_SECONDS,
    data: { id, name },
  }, JWT_SECRET);
}

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

    const userData = getDataFromToken(token);

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

    const { name, id } = response;

    const token = createFreshToken(id, name);

    ctx.body = {
      status: 'success',
      token,
      name,
      id,
    };
  })
  .post('/validate', (ctx) => {
    const data = getDataFromToken(ctx.request.body.token);

    if (!data) {
      ctx.body = { status: 'error' };
      return;
    }

    const { id, name } = data.data;
    const token = createFreshToken(id, name);

    ctx.body = {
      status: 'success',
      token,
      name,
      id,
    };
  });

app.use(router.routes());
app.use(koaJson());

if (require.main === module) {
  server.listen(config.apiPort);
}

export default server;
