import React from 'react';
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';

import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import BarView from 'containers/BarView';
import BarListView from 'containers/BarListView';

function Root({ route, auth }) {
  if (!auth.isAuthenticated) {
    // return <LoginView />;
    return <BarListView />;
  }

  switch(route.name) {
    case 'index': {
      return <IndexView />;
    } break;
    case 'bar': {
      return <BarView />;
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
  auth: state.auth,
  ...routeNodeSelector('')(state),
}))(Root);