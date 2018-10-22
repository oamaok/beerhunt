import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { BeerListing } from 'components';
import styles from './add-beer-view.scss';
import { getBars, getBeerTypes, getToken } from '../../selectors';
import { setCurrentView } from '../../actions'
import { addBeer } from '../../api';

const css = classNames.bind(styles);

const volumes = [
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

class AddBeerView extends React.Component {
  state = {
    bar: 0,
    beerType: 0,
    volume: 0.33,
    abv: 4.5,

    isSubmitting: false
  }

  onSubmit = () => {
    const { beerType, bar, volume, abv } = this.state;
    const { token } = this.props
    this.setState({ isSubmitting: true })

    addBeer({
  type: beerType, volume, abv, bar, token,}).then(() => {
    this.setState({ isSubmitting: false })
    this.props.setCurrentView(1)
  })
  }

  bind = key => ({
    value: this.state[key],
    onChange: evt => this.setState({ [key]: evt.target.value }),
  })

  render() {
    const { bind } = this;
    const { bars, beerTypes } = this.props;
    const { bar, beerType, volume, abv, isSubmitting } = this.state;


    return (
      <div className={css('view')}>
        <h3>Lisää olut</h3>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Missä baarissa?</label>
          <select {...bind('bar')} disabled={isSubmitting}>
            {bars.map((bar, index) => <option value={index} key={index}>{bar}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Minkä tyyppistä?</label>
          <select {...bind('beerType')} disabled={isSubmitting}>
            {beerTypes.map((beerType, index) => <option value={index} key={index}>{beerType}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Kuinka ison?</label>
          <select {...bind('volume')} disabled={isSubmitting}>
            {volumes.map(({ value, name }) => <option value={value}>{name}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Kuinka vahvaa?</label>
          <input {...bind('abv')} disabled={isSubmitting} />
        </div>
        <hr />
        <h3>Oluesi oli siis</h3>
        <BeerListing
          bar={bars[bar]}
          beerType={beerTypes[beerType]}
          volume={volume}
          abv={abv}
        />
        <button type="button" className={css('submit')} onClick={this.onSubmit} disabled={isSubmitting}>
          Lisää listallesi
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bars: getBars(state),
  beerTypes: getBeerTypes(state),
  token: getToken(state)
});

const mapDispatchToProps = {
  setCurrentView,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBeerView);
