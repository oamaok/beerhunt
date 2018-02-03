import React from 'react';
import { connect } from 'react-redux';

import * as R from 'ramda';

function Stats({ beers: rawBeers, bars, types, name }) {
  const beers = rawBeers.map(beer => ({
    ...beer,
    volume: parseFloat(beer.volume),
    abv: parseFloat(beer.abv),
  }))
  .filter(beer => !isNaN(beer.volume) && !isNaN(beer.abv))
  .filter(beer => beer.name != 'Jorma' || name == 'Jorma');

  if (beers.length === 0 || bars.lengt === 0 || types.length === 0) {
    return null;
  }

  console.log(name)


  const totalBeers = beers.length;
  const highestAbv = beers.reduce(R.maxBy(R.prop('abv')), { name: '-', abv: 0 });
  const lowestAbv = beers.reduce(R.minBy(R.prop('abv')), { name: '-', abv: Infinity });



  const totalBeer = beers.reduce((acc, { volume }) => acc + volume , 0)
  const totalAlcohol = beers.reduce((acc, { volume, abv }) => acc + volume * abv * 0.01, 0)

  const styleGroups = R.toPairs(R.groupBy(R.prop('beerType'), beers));
  const favoriteStyle = R.nth(R.map(R.head, R.sortBy(([, n]) => -n.length, styleGroups))[0], types);

  const barGroups = R.toPairs(R.groupBy(R.prop('bar'), beers));

  const barVolumes = barGroups.map(([a, b]) => [a, R.sum(R.map(R.prop('volume'), b))]);
  const [ popularBarId, popularBarVolume ] = R.last(R.sortBy(R.last, barVolumes));


  const nameGroups = R.toPairs(R.groupBy(R.prop('name'), beers));
  const nameVolumes = nameGroups.map(([a, b]) => [a, R.sum(R.map(R.prop('volume'), b))]);
  const [ drinker, drinkerVolume ] = R.last(R.sortBy(R.last, nameVolumes));

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
        <div className="label">Favorite bar by volume:</div>
        <div className="value"><b>{bars[popularBarId]}</b> with <b>{popularBarVolume.toFixed(2)} liters</b></div>
      </div>
    </div>
  );
}

export default connect(state => ({
  beers: state.beers,
  bars: state.fixtures.bars,
  types: state.fixtures.beerTypes,
  name: state.auth.name,
}))(Stats);