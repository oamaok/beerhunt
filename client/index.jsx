import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser';
import { router5Middleware, router5Reducer } from 'redux-router5';
import ReduxThunk from 'redux-thunk';

import routes from './routes';
import Root from 'containers/Root';

import { fetchBeers, setName, fetchBars, fetchBeerTypes } from './actions';
import reducer from './reducer'


const router = createRouter(routes, {
  defaultRoute: 'index',
});

router.usePlugin(browserPlugin({
  useHash: true
}));

const store = createStore(
  combineReducers({
    router: router5Reducer,
    app: reducer,
  }),
  applyMiddleware(
    router5Middleware(router),
    ReduxThunk
  )
);

store.dispatch(fetchBars());
store.dispatch(fetchBeerTypes());

(function beerRefreshLoop() {
  store.dispatch(fetchBeers());
  setTimeout(beerRefreshLoop, 1000 * 60)
})()

const name = localStorage.getItem('ebh-name');
if (name) {
  store.dispatch(setName(name))
}

router.start();

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Root />
      </Provider>
    </AppContainer>,
    document.querySelector('#root'),
  )
}

render()

if (module.hot) {
  module.hot.accept('containers/Root', () => {
    render()
  })
}
