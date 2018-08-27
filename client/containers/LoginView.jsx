import React from 'react';
import { connect } from 'react-redux';
import { connectFacebook } from '../actions';

function LoginView({ auth, connectFacebook }) {
  return (
    <div className="login-view container">
      <h1>Welcome to Espoo Beer Hunt!</h1>

      <p>Connect with Facebook to join the fun!</p>
      <button
        type="button"
        className="btn btn-primary"
        disabled={auth.isLoading}
        onClick={connectFacebook}
      >Continue with Facebook
      </button>
    </div>
  );
}

export default connect(state => state.app, { connectFacebook })(LoginView);
