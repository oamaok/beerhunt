import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { loginWithFacebook } from '../actions';
import styles from './LoginView.scss';

const css = classNames.bind(styles);

function LoginView({ auth, loginWithFacebook }) {
  return (
    <div className={css('login-view')}>

      <h2>
        Trapped in <span className={css('highlight')}>amber</span>
      </h2>
      <button
        type="button"
        className="btn btn-primary"
        disabled={auth.isLoading}
        onClick={loginWithFacebook}
      >Kirjaudu Facebookilla
      </button>
    </div>
  );
}

export default connect(state => ({ auth: state.app.auth }), { loginWithFacebook })(LoginView);
