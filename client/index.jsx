import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import createRouter from 'router5';
import browserPlugin from 'router5/plugins/browser';
import { router5Middleware, router5Reducer } from 'redux-router5';
import ReduxThunk from 'redux-thunk';

import './styles/reset.scss';

import AppRoot from 'components/app-root';
import routes from './routes';
import { onceFacebookLoaded } from './facebook';

import {
  fetchBeers,
  fetchBars,
  fetchBeerTypes,
  validateToken,
  facebookLoaded,
} from './actions';

import reducer from './reducer';

function initializeRouter() {
  const router = createRouter(routes, {
    defaultRoute: 'index',
  });

  router.usePlugin(browserPlugin({
    useHash: true,
  }));

  return router;
}

async function initializeStore(router) {
  const store = createStore(
    combineReducers({
      router: router5Reducer,
      app: reducer,
    }),
    applyMiddleware(
      router5Middleware(router),
      ReduxThunk,
    ),
  );

  const { dispatch } = store;

  dispatch(fetchBars());
  dispatch(fetchBeerTypes());

  await dispatch(validateToken(localStorage.getItem('ebh_token')));

  return store;
}

function render(store) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <AppRoot />
      </Provider>
    </AppContainer>,
    document.querySelector('#root'),
  );
}

async function initializeApplication() {
  const router = initializeRouter();
  const store = await initializeStore(router);

  router.start();
  render(store);

  onceFacebookLoaded(() => {
    store.dispatch(facebookLoaded());
  });

  // Refresh beers every five seconds
  (function beerRefreshLoop() {
    store.dispatch(fetchBeers());
    setTimeout(beerRefreshLoop, 1000 * 5);
  }());

  // Initialize hot module reloading
  if (module.hot) {
    module.hot.accept('components/app-root', () => {
      render();
    });
  }
}

initializeApplication();
