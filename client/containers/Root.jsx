import React from 'react';
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';

import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import BarView from 'containers/BarView';
import BarListView from 'containers/BarListView';

function Root({ route, app }) {
  if (!app.hasAuthenticated) {
    return <LoginView />;
  }

  switch(route.name) {
    case 'index': {
      return <IndexView />;
    } break;
    case 'bar': {
      return <BarView params={route.params} />;
    } break;
    case 'bars': {
      return <BarListView />;
    } break;
    case 'index': {
      return <IndexView />;
    } break;

    default:
      // TODO: Implement NotFoundView?
  }
}

export default connect(state => ({
  app: state.app,
  ...routeNodeSelector('')(state),
}))(Root);