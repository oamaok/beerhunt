import React from 'react';
import { connect } from 'react-redux';

import * as R from 'ramda';

function Stats({ beers: rawBeers, bars, types }) {
  const beers = rawBeers.map(beer => ({
    ...beer,
    volume: parseFloat(beer.volume),
    abv: parseFloat(beer.abv),
  }))
  .filter(beer => !isNaN(beer.volume) && !isNaN(beer.abv))

  const totalBeers = beers.length;
  const highestAbv = beers.reduce(R.maxBy(R.prop('abv')), { name: '-', abv: 0 });
  const lowestAbv = beers.reduce(R.minBy(R.prop('abv')), { name: '-', abv: Infinity });

  const totalBeer = beers.reduce((acc, { volume }) => acc + volume , 0)
  const totalAlcohol = beers.reduce((acc, { volume, abv }) => acc + volume * abv, 0)

  const styleGroups = R.toPairs(R.groupBy(R.prop('beerType'), beers));
  const favoriteStyle = R.nth(R.map(R.head, R.sortBy(([, n]) => -n.length, styleGroups))[0], types)

  const barGroups = R.toPairs(R.groupBy(R.prop('bar'), beers));
  const favoriteBar = R.nth(R.map(R.head, R.sortBy(([, n]) => -n.length, styleGroups))[0], bars)

  return (
    <div className="stats">
      <h2>Statistics</h2>
      <div className="stat">
        <div className="label">Total beers consumed:</div>
        <div className="value"><b>{totalBeers}</b></div>
      </div>
      <div className="stat">
        <div className="label">Highest ABV beer:</div>
        <div className="value"><b>{highestAbv.abv.toFixed(1)}%</b> by <b>{highestAbv.name}</b></div>
      </div>
      <div className="stat">
        <div className="label">Lowest ABV beer:</div>
        <div className="value"><b>{lowestAbv.abv.toFixed(1)}%</b> by <b>{lowestAbv.name}</b></div>
      </div>
      <div className="stat">
        <div className="label">Total amount of beer consumed:</div>
        <div className="value"><b>{totalBeer.toFixed(2)} liters</b></div>
      </div>
      <div className="stat">
        <div className="label">Total amount of alcohol consumed:</div>
        <div className="value"><b>{totalAlcohol.toFixed(2)} liters</b></div>
      </div>
      <div className="stat">
        <div className="label">Favorite style among the hunters:</div>
        <div className="value"><b>{favoriteStyle}</b></div>
      </div>
      <div className="stat">
        <div className="label">Favorite bar by beers:</div>
        <div className="value"><b>{favoriteBar}</b></div>
      </div>
    </div>
  );
}

export default connect(state => ({
  beers: state.beers,
  bars: state.fixtures.bars,
  types: state.fixtures.beerTypes,
}))(Stats);