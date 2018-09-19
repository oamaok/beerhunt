import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'redux-router5';
import { addBeer } from '../../api';
import { fetchBeers } from '../../actions';

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

  addBeer = async () => {
    this.setState({
      disabled: true,
    });

    const {
      beerType,
      volume,
      abv,
    } = this.state;

    const {
      fetchBeers,
      navigateTo,
      auth,
    } = this.props;


    await addBeer({
      token: auth.token,
      bar: 0,
      type: beerType,
      volume,
      abv,
    });

    fetchBeers();

    navigateTo('index');
  }

  beerTypeChange = (evt) => {
    this.setState({
      beerType: evt.target.value,
    });
  }

  volumeChange = (evt) => {
    this.setState({
      volume: evt.target.value,
    });
  }

  abvChange = (evt) => {
    this.setState({
      abv: evt.target.value,
    });
  }

  tweakAbv = (amount) => {
    this.setState(({ abv }) => ({
      abv: parseFloat((abv + amount).toFixed(1)),
    }));
  }

  render() {
    const {
      disabled, beerType, volume, abv,
    } = this.state;

    const {
      types,
      bars,
    } = this.props;

    const currentBar = bars[0];

    return (
      <div className="bar-view container">
        <h2>{currentBar}</h2>

        <label htmlFor="beer-type">What did you drink?</label>
        <div className="input-group">
          <select className="form-control" id="beer-type" value={beerType} onChange={this.beerTypeChange} disabled={disabled}>
            {types.map((type, index) => <option value={index} key={type}>{type}</option>)}
          </select>
        </div>
        <hr />
        <label htmlFor="beer-type">How much did you drink?</label>
        <div className="input-group">
          <select className="form-control" id="beer-type" value={volume} onChange={this.volumeChange} disabled={disabled}>
            {sizes.map(({ name, value }) => <option value={value} key={value}>{name}</option>)}
          </select>
        </div>
        <hr />

        <label htmlFor="beer-type">How strong was it?</label>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <button
              className="btn btn-warning"
              disabled={disabled}
              onClick={() => this.tweakAbv(-1)}
              type="button"
            >
-1%
            </button>
            <button
              className="btn btn-warning"
              disabled={disabled}
              onClick={() => this.tweakAbv(-0.1)}
              type="button"
            >
-.1%
            </button>
          </div>
          <input
            type="number"
            disabled={disabled}
            className="form-control"
            value={abv}
            onChange={this.abvChange}
          />
          <div className="input-group-append">
            <span className="input-group-text">%</span>
            <button
              className="btn btn-success"
              disabled={disabled}
              onClick={() => this.tweakAbv(0.1)}
              type="button"
            >
+.1%
            </button>
            <button
              className="btn btn-success"
              disabled={disabled}
              onClick={() => this.tweakAbv(1)}
              type="button"
            >
+1%
            </button>
          </div>
        </div>
        <hr />

        <button type="button" onClick={this.addBeer} className="btn btn-success add-beer">Add a beer!</button>

        <button
          type="button"
          onClick={() => this.props.navigateTo('index')}
          className="btn btn-warning add-beer"
        >
cancel
        </button>

      </div>
    );
  }
}

export default connect(state => ({
  types: state.app.beerTypes,
  bars: state.app.bars,
  auth: state.app.auth,
}), { fetchBeers, navigateTo: actions.navigateTo })(BarView);
