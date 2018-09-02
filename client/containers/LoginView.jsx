import React from 'react';
import { connect } from 'react-redux';
import { loginWithFacebook } from '../actions';

function LoginView({ auth, loginWithFacebook }) {
  return (
    <div className="login-view container">
      <h1>Welcome to Espoo Beer Hunt!</h1>

      <p>Connect with Facebook to join the fun!</p>
      <button
        type="button"
        className="btn btn-primary"
        disabled={auth.isLoading}
        onClick={loginWithFacebook}
      >Continue with Facebook
      </button>
    </div>
  );
}

export default connect(state => ({ auth: state.app.auth }), { loginWithFacebook })(LoginView);
