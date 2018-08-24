import React from 'react';
import { connect } from 'react-redux';
import { setName } from '../actions';

class LoginView extends React.Component {
  state = {
    name: '',
  }

  onChange = (evt) => {
    this.setState({
      name: evt.target.value,
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    this.props.setName(this.state.name);
  }

  render() {
    return (
      <form className="login-view container" onSubmit={this.onSubmit}>
        <h1>Welcome to Espoo Beer Hunt!</h1>

        <label htmlFor="name">Enter your name to join the fun! Please enter your full name to avoid overlapping names!</label>
        <div className="input-group">
          <input
            type="text"
            placeholder="Matti Meikäläinen"
            className="form-control"
            id="name"
            onChange={this.onChange}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-outline-secondary">Go!</button>
          </div>
        </div>
      </form>
    );
  }
}

export default connect(null, { setName })(LoginView);
