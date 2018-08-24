import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'redux-router5';
import { apiCall } from '../api';
import { fetchBeers } from '../actions';

const sizes = [
  { value: 0.2, name: '20cl' },
  { value: 0.25, name: '25cl' },
  { value: 0.3, name: '30cl' },
  { value: 0.33, name: '33cl' },
  { value: 0.35, name: '35cl' },
  { value: 0.4, name: '40cl' },
  { value: 0.45, name: '45cl' },
  { value: 0.5, name: '50cl' },
  { value: 0.55, name: '55cl' },
  { value: 0.60, name: '60cl' },
];

class BarView extends React.Component {
  state = {
    beerType: 0,
    volume: 0.33,
    abv: 4.5,
    disabled: false,
  }

  addBeer = (() => async () => {
    this.setState({
      disabled: true,
    });

    const {
      beerType,
      volume,
      abv,
    } = this.state;

    await apiCall('beer', {
      method: 'POST',
      body: JSON.stringify({
        beerType: parseInt(beerType),
        volume,
        abv: isNaN(parseFloat(abv)) ? 0 : parseFloat(abv),
        name: this.props.name,
        bar: parseInt(this.props.params.barId),
      }),
    });

    this.props.fetchBeers();

    this.props.navigateTo('index');
  })()

  beerTypeChange = (evt) => {
    this.setState({
      beerType: evt.target.value,
    })
  }

  volumeChange = (evt) => {
    this.setState({
      volume: evt.target.value,
    })
  }

  abvChange = (evt) => {
    this.setState({
      abv: evt.target.value,
    })
  }

  tweakAbv = (amount) => {
    this.setState(({ abv }) => ({
      abv: parseFloat((abv + amount).toFixed(1))
    }))
  }

  render() {
    const {
      beerTypes: types,
      bars,
      params,
    } = this.props;

    const currentBar = bars[params.barId];

    return (
      <div className="bar-view container">
        <h2>{currentBar}</h2>

        <label htmlFor="beer-type">What did you drink?</label>
        <div className="input-group">
          <select className="form-control" id="beer-type" value={this.state.beerType} onChange={this.beerTypeChange}>
            {types.map((type, index) => 
              <option value={index} key={index}>{type}</option>
            )}
          </select>
        </div>
        <hr />
        <label htmlFor="beer-type">How much did you drink?</label>
        <div className="input-group">
          <select className="form-control" id="beer-type" value={this.state.volume} onChange={this.volumeChange}>
            {sizes.map(({ name, value }) => 
              <option value={value} key={value}>{name}</option>
            )}
          </select>
        </div>
        <hr />

        <label htmlFor="beer-type">How strong was it?</label>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <button
              className="btn btn-warning"
              onClick={() => this.tweakAbv(-1)}
              type="button"
            >-1%</button>
            <button
              className="btn btn-warning"
              onClick={() => this.tweakAbv(-.1)}
              type="button"
            >-.1%</button>
          </div>
          <input
            type="number"
            className="form-control"
            value={this.state.abv}
            onChange={this.abvChange}
          />
          <div className="input-group-append">
            <span className="input-group-text">%</span>
            <button className="btn btn-success"
              onClick={() => this.tweakAbv(.1)} type="button">+.1%</button>
            <button className="btn btn-success"
              onClick={() => this.tweakAbv(1)} type="button">+1%</button>
          </div>
        </div>
        <hr />

        <button type="button" onClick={this.addBeer} className="btn btn-success add-beer">Add a beer!</button>

        <button
          type="button"
          onClick={() => this.props.navigateTo('index')}
          className="btn btn-warning add-beer"
        >cancel</button>

      </div>
    );
  }
}

export default connect(state => state.app, { fetchBeers, navigateTo: actions.navigateTo })(BarView);