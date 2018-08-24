import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'redux-router5';
import Stats from 'containers/Stats';
import { updateFacebookStatus } from '../actions';

function IndexView({ navigateTo, updateFacebookStatus, bars }) {
  const logout = async () => {
    const response = await new Promise(FB.logout);
    updateFacebookStatus(response);
  };

  return (
    <div className="index-view container">
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

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default connect(state => ({
  bars: state.app.bars,
}), {
  navigateTo: actions.navigateTo,
  updateFacebookStatus,
})(IndexView);
