import Router from 'koa-router';
import request from 'request-promise-native';
import jwt from 'jsonwebtoken';

import {
  getBeers, addBeer, getBeerById, deleteBeer, updateBeerReview,
} from './database';

import bars from './data/bars.json';
import types from './data/types.json';

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

export default function createRouter(db) {
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
    .get('/beers', async (ctx) => {
      ctx.body = await getBeers(db);
    })
    .post('/review', async (ctx) => {
      const {
        beerId, starRating, review,
      } = ctx.request.body;

      // TODO: Validate against token
      await updateBeerReview(db, beerId, starRating, review);

      ctx.body = { status: 'success' };
    })
    .post('/beer', async (ctx) => {
      const {
        bar,
        beerType,
        volume,
        abv,
        price,
        token,
      } = ctx.request.body;

      const userData = getDataFromToken(token);

      if (!userData) {
        ctx.body = { status: 'error' };
        return;
      }

      const { id, name } = userData.data;

      const beer = await addBeer(db, {
        barId: bar,
        typeId: beerType,
        personId: id,
        personName: name,
        volume,
        abv,
        price,
      });

      ctx.body = { status: 'success', beer };
    })
    .post('/auth', async (ctx) => {
      const rawResponse = await request.get(
        `https://graph.facebook.com/me?access_token=${ctx.request.body.accessToken}`,
      );
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
    })
    .post('/delete', async (ctx) => {
      const {
        beerId,
        token,
      } = ctx.request.body;

      const userData = getDataFromToken(token);

      if (!userData) {
        ctx.body = { status: 'error' };
        return;
      }

      const { id } = userData.data;
      const [beer] = await getBeerById(db, beerId);

      if (!beer) {
        ctx.body = { status: 'error' };
        return;
      }

      const { personId } = beer;

      if (personId.toString() !== id) {
        ctx.body = { status: 'error' };
        return;
      }

      await deleteBeer(db, beerId);

      ctx.body = { status: 'success' };
    });

  return router;
}
