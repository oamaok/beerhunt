import React from 'react';
import { connect } from 'react-redux';

import AppFrame from 'components/app-frame';
import LoginView from 'components/login-view';
import Router from 'components/router';

function Root({ auth }) {
  if (!auth.token) {
    return <LoginView />;
  }

  return (
    <AppFrame>
      <Router />
    </AppFrame>
  );
}

export default connect(state => ({
  auth: state.app.auth,
}))(Root);
