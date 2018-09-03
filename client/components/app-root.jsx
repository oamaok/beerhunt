import React from 'react';
import { connect } from 'react-redux';
import { createRouteNodeSelector } from 'redux-router5';

import IndexView from 'components/index-view';
import LoginView from 'components/login-view';
import BarView from 'components/bar-view';

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
