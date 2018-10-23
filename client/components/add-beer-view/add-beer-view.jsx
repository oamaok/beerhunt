import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { BeerListing } from 'components';
import styles from './add-beer-view.scss';
import { getBars, getBeerTypes, getToken } from '../../selectors';
import { setCurrentView } from '../../actions';
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
    bar: 'Choose location',
    beerType: 'Choose type',
    volume: 'Choose size',
    abv: 4.5,
    description: '',

    defaultBar: 'Choose location',
    defaultBeerType: 'Choose type',
    defaultVolume: 'Choose size',

    isValid: false,
    isSubmitting: false,
  }

  onSubmit = () => {
    const {
      beerType, bar, volume, abv, description,
    } = this.state;
    const { token } = this.props;
    this.setState({ isSubmitting: true });

    addBeer({
      type: beerType, volume, abv, bar, token, description
    }).then(() => {
      this.setState({ isSubmitting: false });
      this.props.setCurrentView(1);

      this.state.bar = this.state.defaultBar;
      this.state.beerType = this.state.defaultBeerType;
      this.state.volume = this.state.defaultVolume;
      this.state.abv = 4.5;
      this.state.description = '';
    });
  }

  bind = key => ({
    value: this.state[key],
    onChange: evt => this.setState({ [key]: evt.target.value }),
  })

  render() {
    this.state.isValid = (
      this.state.bar != this.state.defaultBar &&
      this.state.beerType != this.state.defaultBeerType && 
      this.state.volume != this.state.defaultVolume)

    const { bind } = this;
    const { bars, beerTypes } = this.props;
    const {
      bar, beerType, volume, abv, description, 
      defaultBar, defaultBeerType, defaultVolume, isValid, isSubmitting,
    } = this.state;


    return (
      <div className={css('view')}>
        <h3>Add a new beer</h3>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Location?</label>
          <select {...bind('bar')} disabled={isSubmitting}>
            <option value={defaultBar} selected disabled hidden>{defaultBar}</option>
            {bars.map((bar, index) => <option value={index} key={index}>{bar}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Type?</label>
          <select {...bind('beerType')} disabled={isSubmitting}>
            <option value={defaultBeerType} selected disabled hidden>{defaultBeerType}</option>
            {beerTypes.map((beerType, index) => <option value={index} key={index}>{beerType}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Size?</label>
          <select {...bind('volume')} disabled={isSubmitting}>
            <option value={defaultVolume} selected disabled hidden>{defaultVolume}</option>
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
        <hr />
        <h3>Summary</h3>
        {isValid ? 
          <BeerListing
          bar={bars[bar]}
          beerType={beerTypes[beerType]}
          volume={volume}
          abv={abv}
          description={description}
        /> : null
        }
        <button type="button" className={css('submit')} onClick={this.onSubmit} disabled={isSubmitting || !isValid}>
          Add to your list!
        </button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBeerView);
