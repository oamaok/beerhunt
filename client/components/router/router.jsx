import React from 'react';
import { connect } from 'react-redux';
import { createRouteNodeSelector } from 'redux-router5';

import { BarView, IndexView } from 'components';

function Router({ route }) {
  switch (route.name) {
    case 'index':
      return <IndexView />;
    case 'bar':
      return <BarView params={route.params} />;

    default:
      // TODO: Implement NotFoundView?
      return null;
  }
}

export default connect(state => ({
  ...createRouteNodeSelector('')(state),
}))(Router);
