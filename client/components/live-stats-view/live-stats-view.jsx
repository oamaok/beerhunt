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
  const totalBeerPrice = beers.reduce((acc, { price }) => acc + price, 0);
  const groupedPerson = R.toPairs(R.groupBy(R.prop('personName'), beers));
  const groupedType = R.toPairs(R.groupBy(R.prop('typeId'), beers));

  const personWithMostBeers = groupedPerson.reduce(R.maxBy(([, beers]) => beers.length), ['-', []]);
  const typeWithMostBeers = groupedType.reduce(R.maxBy(([, beers]) => beers.length), ['-', []]);
  const personWithPriciestBeer = beers.reduce((currentMax, beer) => {
    if (currentMax.price > beer.price) {
      return currentMax;
    }
    return {
      name: beer.personName,
      price: beer.price,
      type: beerTypes[beer.typeId],
    };
  }, { name: '-', price: 0, type: '-' });

  // console.log(groupedPerson);
  console.log(typeWithMostBeers);
  // console.log(personWithPriciestBeer);

  const fullPriceLabel = totalBeerPrice > 1000 ? 'Kokonaishinta (v***n juopot)' : 'Kokonaishinta';

  return (
    <div>
      <h1>Live-tulokset</h1>
      <div className={css('status-blocks')}>
        {typeWithMostBeers[0] != '-'
          ? <StatusBlock width="1" height="1" label="Suosituin juomatyyppi" value={`${beerTypes[typeWithMostBeers[0]]}`} /> : null
        }
        <StatusBlock width="1" height="1" label="Juotuja juomia yhteensä (kpl)" value={totalBeers} />
        <StatusBlock width="1" height="1" label="Kokonaismäärä" value={`${totalBeerVolume}l`} />
        <StatusBlock width="1" height="1" label={fullPriceLabel} value={`${totalBeerPrice}€`} />
        {personWithMostBeers[0] != '-'
          ? <StatusBlock width="2" height="1" label="Eniten juotuja juomia" value={`${personWithMostBeers[0]} - ${personWithMostBeers[1].length}`} /> : null
        }
        {personWithPriciestBeer.name != '-'
          ? (
            <StatusBlock
              width="2"
              height="1"
              label="Kallein juoma"
              value={`
            ${personWithPriciestBeer.name} - 
            ${personWithPriciestBeer.type} / 
            ${personWithPriciestBeer.price}€`}
            />
          ) : null
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
