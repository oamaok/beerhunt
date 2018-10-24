import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { getBars, getBeers, getBeerTypes } from '../../selectors';
import styles from './live-stats-view.scss';

import BeerListing from '../beer-listing/beer-listing';

const css = classNames.bind(styles);

function StatusBlock({
  width,
  height,
  label,
  value,
}) {
  return (
    <div className={css('block', `width-${width}`, `height-${height}`)}>
      <div className={css('value')}>{value}</div>
      <div className={css('label')}>{label}</div>
    </div>
  );
}

function LiveStatsView({ beers, bars, beerTypes }) {
  const latestFiveBeers = R.sortBy(R.prop('loggedAt'), beers)
    .reverse()
    .slice(0, 5)
    .map(beer => (
      <BeerListing
        location={bars[beer.barId]}
        beerType={beerTypes[beer.typeId]}
        volume={beer.volume}
        abv={beer.abv}
        personName={beer.personName}
        personId={beer.personId}
      />
    ));

  return (
    <div>
      <h1>Live-tulokset</h1>
      <div className={css('status-blocks')}>
        <StatusBlock width="1" height="1" label="Juotuja oluita" value={200} />
        <StatusBlock width="1" height="1" label="Juotuja oluita" value={200} />
        <StatusBlock width="2" height="1" label="Juotuja oluita" value={200} />
      </div>

      <h3>Viisi viimeisintä</h3>
      <div className={css('latest-beers-list')} />
      {R.intersperse(<hr />, latestFiveBeers)}
    </div>
  );
}

const mapStateToProps = state => ({
  bars: getBars(state),
  beers: getBeers(state),
  beerTypes: getBeerTypes(state),
});

export default connect(mapStateToProps)(LiveStatsView);
