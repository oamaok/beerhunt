import React from 'react';
import { connect } from 'react-redux';
import { updateFacebookStatus } from '../actions';

class LoginView extends React.Component {
  state = {
    isLoggingIn: false,
  }

  connectWithFacebook = async () => {
    this.setState({ isLoggingIn: true });
    const response = await new Promise(FB.login);
    this.props.updateFacebookStatus(response);
    this.setState({ isLoggingIn: false });
  }

  render() {
    return (
      <div className="login-view container">
        <h1>Welcome to Espoo Beer Hunt!</h1>

        <p>Connect with Facebook to join the fun!</p>
        <button type="button" className="btn btn-primary" disabled={this.state.isLoggingIn} onClick={this.connectWithFacebook}>Continue with Facebook</button>
      </div>
    );
  }
}

export default connect(null, { updateFacebookStatus })(LoginView);
