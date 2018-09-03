import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'redux-router5';
import Stats from 'components/stats';
import { clearCredentials } from '../actions';

function IndexView({
  navigateTo, clearCredentials, appState,
}) {
  const { bars, auth } = appState;
  const firstName = auth.name.split(' ')[0];

  return (
    <div className="index-view container">
      <h2>Hi {firstName}!</h2>
      <h2>Welcome to Espoo Beer Hunt!</h2>
      <p>Add beers to the bars you visit during the hunt!</p>

      <div className="input-group">
        <select className="form-control" onChange={evt => navigateTo('bar', { barId: evt.target.value })}>
          <option selected disabled>Select a bar!</option>
          {bars.map((bar, index) => <option value={index} key={index}>{bar}</option>)}
        </select>
      </div>
      <hr />
      <Stats />

      <button type="button" className="btn btn-primary" onClick={clearCredentials}>Logout</button>
    </div>
  );
}

export default connect(state => ({ appState: state.app }), {
  navigateTo: actions.navigateTo,
  clearCredentials,
})(IndexView);
