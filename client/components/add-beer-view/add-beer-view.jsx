import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { BeerListing } from 'components';
import styles from './add-beer-view.scss';
import { getBars, getBeerTypes, getToken } from '../../selectors';
import { setCurrentView, fetchBeers } from '../../actions';
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

const DEFAULT_BAR = 'Choose location';
const DEFAULT_BEER_TYPE = 'Choose type';
const DEFAULT_VOLUME = 'Choose size';

class AddBeerView extends React.Component {
  state = {
    bar: DEFAULT_BAR,
    beerType: DEFAULT_BEER_TYPE,
    volume: DEFAULT_VOLUME,
    abv: 4.5,
    description: '',

    isSubmitting: false,
  }

  onSubmit = async () => {
    const {
      beerType, bar, volume, abv, description,
    } = this.state;
    const { token } = this.props;
    this.setState({ isSubmitting: true });

    await addBeer({
      type: beerType, volume, abv, bar, token, description,
    });

    await this.props.fetchBeers();

    this.setState(
      {
        isSubmitting: false,
        bar: DEFAULT_BAR,
        beerType: DEFAULT_BEER_TYPE,
        volume: DEFAULT_VOLUME,
        abv: 4.5,
        description: '',
      },
    );
    this.props.setCurrentView(1);
  }

  bind = key => ({
    value: this.state[key],
    onChange: evt => this.setState({ [key]: evt.target.value }),
  })

  render() {
    const { bind } = this;
    const { bars, beerTypes } = this.props;
    const {
      bar, beerType, volume, abv, description, isSubmitting,
    } = this.state;

    const isValid = (
      bar !== DEFAULT_BAR
      && beerType !== DEFAULT_BEER_TYPE
      && volume !== DEFAULT_VOLUME);


    return (
      <div className={css('view')}>
        <h3>Add a new drink</h3>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Location?</label>
          <select {...bind('bar')} disabled={isSubmitting}>
            <option value={DEFAULT_BAR} selected disabled hidden>{DEFAULT_BAR}</option>
            {bars.map((bar, index) => <option value={index} key={index}>{bar}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Type?</label>
          <select {...bind('beerType')} disabled={isSubmitting}>
            <option value={DEFAULT_BEER_TYPE} selected disabled hidden>{DEFAULT_BEER_TYPE}</option>
            {beerTypes.map((beerType, index) => <option value={index} key={index}>{beerType}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Size?</label>
          <select {...bind('volume')} disabled={isSubmitting}>
            <option value={DEFAULT_VOLUME} selected disabled hidden>{DEFAULT_VOLUME}</option>
            {volumes.map(({ value, name }) => <option value={value}>{name}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Strength?</label>
          <input {...bind('abv')} disabled={isSubmitting} />
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Add a description:</label>
          <textarea {...bind('description')} disabled={isSubmitting} />
        </div>
        {!isValid ? <div>Täytähän kaikki kentät!</div> : null}
        {isValid ? (
          <React.Fragment>
            <hr />
            <h3>Summary</h3>
            <BeerListing
              location={bars[bar]}
              beerType={beerTypes[beerType]}
              volume={volume}
              abv={abv}
              description={description}
            />
            <button
              type="button"
              className={css('submit')}
              onClick={this.onSubmit}
              disabled={isSubmitting || !isValid}
            >
              Add to your list!
            </button>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bars: getBars(state),
  beerTypes: getBeerTypes(state),
  token: getToken(state),
});

const mapDispatchToProps = {
  setCurrentView,
  fetchBeers,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBeerView);
