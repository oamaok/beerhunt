import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import Root from 'containers/Root';

const store = createStore(() => {});

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
