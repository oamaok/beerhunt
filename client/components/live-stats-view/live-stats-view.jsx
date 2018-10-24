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
        price={beer.price}
        personName={beer.personName}
        personId={beer.personId}
      />
    ));

  const totalBeers = beers.length;
  const totalBeerVolume = beers.reduce((acc, { volume }) => acc + volume, 0);
  const grouped = R.toPairs(R.groupBy(R.prop('personName'), beers));

  const personWithMostBeers = grouped.reduce(R.maxBy(([, beers]) => beers.length),
    ['-', []]);
  const personWithPriciestBeer = beers.reduce((currentMax, beer) => {
    if (currentMax.price > beer.price) {
      return currentMax;
    }
    return { name: beer.personName, price: beer.price };
  }, { name: '-', price: 0 });

  return (
    <div>
      <h1>Live-tulokset</h1>
      <div className={css('status-blocks')}>
        <StatusBlock width="1" height="1" label="Oluita juotu yhteensä (kpl)" value={totalBeers} />
        <StatusBlock width="1" height="1" label="Kokonaismäärä" value={`${totalBeerVolume}l`} />
        {personWithMostBeers
          ? <StatusBlock width="1" height="1" label="Eniten juotuja oluita" value={`${personWithMostBeers[0]} - ${personWithMostBeers[1].length}`} /> : null
      }
        {personWithPriciestBeer
          ? <StatusBlock width="1" height="1" label="Kallein olut henkilöllä" value={`${personWithPriciestBeer.name} - ${personWithPriciestBeer.price}€`} /> : null
      }
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
