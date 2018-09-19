import React from 'react';
import { connect } from 'react-redux';

import { AppFrame, LoginView, Router } from 'components';

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
