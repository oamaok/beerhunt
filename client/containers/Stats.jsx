import React from 'react';
import { connect } from 'react-redux';

import * as R from 'ramda';

function Stats({
  rawBeers, bars, types,
}) {
  const beers = rawBeers.map(beer => ({
    ...beer,
    volume: parseFloat(beer.volume),
    abv: parseFloat(beer.abv),
  }))
    .filter(beer => !isNaN(beer.volume) && !isNaN(beer.abv));

  if (beers.length === 0 || bars.length === 0 || types.length === 0) {
    return null;
  }

  const totalBeers = beers.length;
  const highestAbv = beers.reduce(R.maxBy(R.prop('abv')), { personName: '-', abv: 0 });
  const lowestAbv = beers.reduce(R.minBy(R.prop('abv')), { personName: '-', abv: Infinity });


  const totalBeer = beers.reduce((acc, { volume }) => acc + volume, 0);
  const totalAlcohol = beers.reduce((acc, { volume, abv }) => acc + volume * abv * 0.01, 0);

  const styleGroups = R.toPairs(R.groupBy(R.prop('typeId'), beers));
  const favoriteStyle = R.nth(R.map(R.head, R.sortBy(([, n]) => -n.length, styleGroups))[0], types);

  const barGroups = R.toPairs(R.groupBy(R.prop('bar'), beers));

  const barVolumes = barGroups.map(([a, b]) => [a, R.sum(R.map(R.prop('volume'), b))]);
  const [popularBarId, popularBarVolume] = R.last(R.sortBy(R.last, barVolumes));


  const nameGroups = R.toPairs(R.groupBy(R.prop('personName'), beers));
  const nameVolumes = nameGroups.map(([a, b]) => [a, R.sum(R.map(R.prop('volume'), b))]);
  const [drinker, drinkerVolume] = R.last(R.sortBy(R.last, nameVolumes));

  return (
    <div className="stats">
      <h2>fun Statistics!</h2>
      <div className="stat">
        <div className="label">Total beers consumed:</div>
        <div className="value"><b>{totalBeers}</b></div>
      </div>
      <div className="stat">
        <div className="label">Largest consumer by volume:</div>
        <div className="value"><b>{drinker}</b> with <b>{drinkerVolume.toFixed(2)} liters</b></div>
      </div>
      <div className="stat">
        <div className="label">Highest ABV beer:</div>
        <div className="value"><b>{highestAbv.abv.toFixed(1)}%</b> by <b>{highestAbv.personName}</b></div>
      </div>
      <div className="stat">
        <div className="label">Lowest ABV beer:</div>
        <div className="value"><b>{lowestAbv.abv.toFixed(1)}%</b> by <b>{lowestAbv.personName}</b></div>
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
        <div className="label">Favorite bar by volume:</div>
        <div className="value"><b>{bars[popularBarId]}</b> with <b>{popularBarVolume.toFixed(2)} liters</b></div>
      </div>
    </div>
  );
}

export default connect(state => ({
  rawBeers: state.app.beers,
  bars: state.app.bars,
  types: state.app.beerTypes,
}))(Stats);
