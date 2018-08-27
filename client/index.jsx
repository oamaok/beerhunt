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
  fetchBars,
  fetchBeerTypes,
  refreshFacebookStatus,
  validateToken,
  updateAuthStatus,
  FACEBOOK_CONNECTED,
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
        <Root />
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

  // Refresh beers every five seconds
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

window.fbAsyncInit = () => {
  FB.init({
    appId: '1805325732897696',
    cookie: true,
    xfbml: true,
    version: 'v3.1',
  });

  FB.AppEvents.logPageView();
  initializeApplication();
};

/* eslint-disable */
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));