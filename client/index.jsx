import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import createRouter from 'router5'
import { router5Middleware, router5Reducer } from 'redux-router5';
import ReduxThunk from 'redux-thunk';

import routes from './routes';
import Root from 'containers/Root';

import authReducer from 'reducers/auth';
import beersReducer from 'reducers/beers';
import fixturesReducer from 'reducers/fixtures';

import { fetchBeers } from 'actions/beers'; 
import { fetchBars, fetchBeerTypes } from 'actions/fixtures';
import { setName } from 'actions/auth';


const router = createRouter(routes, {
  defaultRoute: 'index',
});

const store = createStore(
  combineReducers({
    router: router5Reducer,
    auth: authReducer,
    beers: beersReducer,
    fixtures: fixturesReducer,
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
