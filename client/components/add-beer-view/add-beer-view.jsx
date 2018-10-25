import React from 'react';
import { range } from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { BeerListing } from 'components';
import styles from './add-beer-view.scss';
import { getBars, getBeerTypes, getToken } from '../../selectors';
import { setCurrentView, fetchBeers } from '../../actions';
import { addBeer, updateBeerReview } from '../../api';

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

const DEFAULT_BAR = 'Valitse sijainti';
const DEFAULT_BEER_TYPE = 'Valitse tyyppi';
const DEFAULT_VOLUME = 'Valitse koko';
const DEFAULT_ABV = '';
const DEFAULT_PRICE = '';

class ReviewEditor extends React.Component {
  state = {
    starRating: 0,
    review: '',
  }

  onSubmit = (evt) => {
    evt.preventDefault();

    this.props.onSubmit(this.state);
  }

  selectRating = star => this.setState({ starRating: star })

  handleReviewChange = evt => this.setState({ review: evt.target.value })

  render() {
    const { starRating, review } = this.state;

    const submitDisabled = starRating === 0 || review.length === 0;

    return (
      <form onSubmit={this.onSubmit} className={css('review-editor')}>
        <h1>Olut lisätty!</h1>
        <div>Halutessasi voit myös antaa oluelle arvostelun ja yhdestä viiteen tähteä.</div>
        <div className={css('star-rating')}>
          {range(1, 6).map(star => (
            <button
              key={star}
              type="button"
              onClick={() => this.selectRating(star)}
              className={css('star')}
            >
              <img
                alt=""
                src={starRating >= star ? '/assets/images/star.png' : '/assets/images/star-outline.png'}
              />
            </button>
          ))}
        </div>
        <textarea onChange={this.handleReviewChange} placeholder="Olut oli mielestäni..." />
        <button type="submit" disabled={submitDisabled}>Lisää arvostelu</button>
        <button className={css('secondary')} type="button" onClick={this.props.backToStats}>Etusivu</button>
      </form>
    );
  }
}

class AddBeerView extends React.Component {
  state = {
    bar: DEFAULT_BAR,
    beerType: DEFAULT_BEER_TYPE,
    volume: DEFAULT_VOLUME,
    abv: DEFAULT_ABV,
    price: DEFAULT_PRICE,
    addedBeer: null,
    isSubmitting: false,
  }


  componentDidUpdate(prevProps) {
    // Reset the added beer when exiting the view
    if (prevProps.active && !this.props.active) {
      setTimeout(() => this.setState({ addedBeer: null }), 200);
    }
  }

  onSubmit = async () => {
    const {
      beerType, bar, volume, abv, price, description,
    } = this.state;
    const { token } = this.props;
    this.setState({ isSubmitting: true });

    const response = await addBeer({
      type: beerType, volume, abv, price, bar, token,
    });

    this.props.fetchBeers();

    this.setState({
      isSubmitting: false,
      bar: DEFAULT_BAR,
      beerType: DEFAULT_BEER_TYPE,
      volume: DEFAULT_VOLUME,
      abv: DEFAULT_ABV,
      price: DEFAULT_PRICE,
      description: '',
      addedBeer: response.beer,
    });
  }

  addReview = async ({ starRating, review }) => {
    await updateBeerReview({
      beerId: this.state.addedBeer.id,
      review,
      starRating,
    });

    this.props.fetchBeers();
    this.props.setCurrentView(1);
  }

  bind = key => ({
    value: this.state[key],
    onChange: evt => this.setState({ [key]: evt.target.value }),
  })

  render() {
    const { bind } = this;
    const { bars, beerTypes, setCurrentView } = this.props;
    const {
      bar,
      beerType,
      volume,
      abv,
      price,
      description,
      isSubmitting,
      addedBeer,
    } = this.state;

    const isValid = (
      bar !== DEFAULT_BAR
      && beerType !== DEFAULT_BEER_TYPE
      && volume !== DEFAULT_VOLUME
      && abv > 0
      && price > 0);

    if (addedBeer) {
      return <ReviewEditor onSubmit={this.addReview} backToStats={() => setCurrentView(1)} />;
    }

    return (
      <div className={css('view')}>
        <h3>Lisää juoma</h3>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Sijainti?</label>
          <select {...bind('bar')} disabled={isSubmitting}>
            <option value={DEFAULT_BAR} selected disabled hidden>{DEFAULT_BAR}</option>
            {bars.map((bar, index) => <option value={index} key={index}>{bar}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Tyyppi?</label>
          <select {...bind('beerType')} disabled={isSubmitting}>
            <option value={DEFAULT_BEER_TYPE} selected disabled hidden>{DEFAULT_BEER_TYPE}</option>
            {beerTypes.map((beerType, index) => <option value={index} key={index}>{beerType}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Koko?</label>
          <select {...bind('volume')} disabled={isSubmitting}>
            <option value={DEFAULT_VOLUME} selected disabled hidden>{DEFAULT_VOLUME}</option>
            {volumes.map(({ value, name }) => <option value={value}>{name}</option>)}
          </select>
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Vahvuus?</label>
          <input type="number" placeholder="Anna vahvuus" {...bind('abv')} disabled={isSubmitting} />
        </div>
        <div className={css('input-group')}>
          <div className={css('icon')} />
          <label>Hinta?</label>
          <input type="number" placeholder="Anna hinta" {...bind('price')} disabled={isSubmitting} />
        </div>
        {!isValid ? <div>Täytähän kaikki kentät!</div> : null}
        {isValid ? (
          <React.Fragment>
            <hr />
            <h3>Yhteenveto</h3>
            <BeerListing
              location={bars[bar]}
              beerType={beerTypes[beerType]}
              volume={volume}
              abv={abv}
              price={price}
              description={description}
            />
            <button
              type="button"
              className={css('submit')}
              onClick={this.onSubmit}
              disabled={isSubmitting || !isValid}
            >
              Lisää listallesi!
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
