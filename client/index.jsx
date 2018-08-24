import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import createRouter from 'router5';
import browserPlugin from 'router5/plugins/browser';
import { router5Middleware, router5Reducer } from 'redux-router5';
import ReduxThunk from 'redux-thunk';

import Root from 'containers/Root';
import routes from './routes';

import {
  fetchBeers,
  setName,
  fetchBars,
  fetchBeerTypes,
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

function initializeStore(router) {
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

  store.dispatch(fetchBars());
  store.dispatch(fetchBeerTypes());

  // Check if we have a name present in the localStorage and initialize the name with it
  const name = localStorage.getItem('ebh-name');
  if (name) {
    store.dispatch(setName(name));
  }

  return store;
}

function render(store) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Root />
      </Provider>
    </AppContainer>,
    document.querySelector('#root'),
  );
}

function initializeApplication() {
  const router = initializeRouter();
  const store = initializeStore(router);

  router.start();
  render(store);

  (function beerRefreshLoop() {
    store.dispatch(fetchBeers());
    setTimeout(beerRefreshLoop, 1000 * 5);
  }());

  // Initialize hot module reloading
  if (module.hot) {
    module.hot.accept('containers/Root', () => {
      render();
    });
  }
}

initializeApplication();
