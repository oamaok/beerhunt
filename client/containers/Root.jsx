import React from 'react';
import { connect } from 'react-redux';
import { createRouteNodeSelector } from 'redux-router5';

import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import BarView from 'containers/BarView';

function Root({ route, app }) {
  if (!app.auth.token) {
    return <LoginView />;
  }

  switch (route.name) {
    case 'index':
      return <IndexView />;
    case 'bar':
      return <BarView params={route.params} />;

    default:
      // TODO: Implement NotFoundView?
  }
}

export default connect(state => ({
  app: state.app,
  ...createRouteNodeSelector('')(state),
}))(Root);
