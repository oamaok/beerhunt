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

import authReducer from 'reducers/auth'

const router = createRouter(routes, {
  defaultRoute: 'index',
});

const store = createStore(
  combineReducers({
    router: router5Reducer,
    auth: authReducer,
  }),
  applyMiddleware(
    router5Middleware(router),
    ReduxThunk
  )
);

router.start();

window.fbAsyncInit = function() {
  FB.init({
    appId: 'your-app-id',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v2.11',
  });
};

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
