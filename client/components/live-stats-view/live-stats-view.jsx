import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { getBars, getBeers, getBeerTypes } from '../../selectors';
import styles from './live-stats-view.scss';

import BeerListing from '../beer-listing/beer-listing';
import StatsCarousel from './stats-carousel.jsx';
import RandomReview from './random-review.jsx';

const css = classNames.bind(styles);

function LiveStatsView({ beers, bars, beerTypes }) {
  const latestFiveBeers = R.sortBy(R.prop('loggedAt'), beers)
    .reverse()
    .slice(0, 5)
    .map(beer => (
      <BeerListing
        key={beer.id}
        location={bars[beer.barId]}
        beerType={beerTypes[beer.typeId]}
        volume={beer.volume}
        abv={beer.abv}
        price={beer.price}
        rating={beer.starRating}
        showRating
        personName={beer.personName}
        personId={beer.personId}
      />
    ));


  return (
    <div>
      <h1>Live-tulokset</h1>
      <StatsCarousel bars={bars} beers={beers} beerTypes={beerTypes} />
      <h3>Satunnainen arvostelu</h3>
      <RandomReview bars={bars} beers={beers} beerTypes={beerTypes} />
      <h3>Viisi viimeisintä</h3>
      <div className={css('latest-beers-list')}>
        {R.intersperse(<hr />, latestFiveBeers)}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  bars: getBars(state),
  beers: getBeers(state),
  beerTypes: getBeerTypes(state),
});

export default connect(mapStateToProps)(LiveStatsView);
