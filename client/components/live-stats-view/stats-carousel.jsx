import React from 'react';
import * as R from 'ramda';
import classNames from 'classnames/bind';
import styles from './stats-carousel.scss';
import { volumes } from '../add-beer-view/add-beer-view';

const css = classNames.bind(styles);

export function StatusBlock({
  width,
  height,
  label,
  value,
  fontSize = 2,
}) {
  return (
    <div className={css('block', `width-${width}`, `height-${height}`)}>
      <div className={css('value')} style={{ fontSize: `${fontSize}em` }}>{value}</div>
      <div className={css('label')}>{label}</div>
    </div>
  );
}

export function StatusBlockContainer({ children }) {
  return <div className={css('status-blocks')}>{children}</div>;
}

export default class StatsCarousel extends React.Component {
  render() {
    const { beers, bars, beerTypes } = this.props;

    const totalBeers = beers.length;
    const totalBeerVolume = beers.reduce((acc, { volume }) => acc + volume, 0).toFixed(1);
    const totalBeerPrice = beers.reduce((acc, { price }) => acc + price, 0).toFixed(2);
    const groupedPerson = R.toPairs(R.groupBy(R.prop('personName'), beers));
    const groupedBar = R.toPairs(R.groupBy(R.prop('barId'), beers));
    const groupedType = R.toPairs(R.groupBy(R.prop('typeId'), beers));
    const groupedVolume = R.toPairs(R.groupBy(R.prop('volume'), beers));

    const amberAleIndex = beerTypes.indexOf('Amber ale');

    const amberAleVolume = beers
      .filter(beer => beer.typeId === amberAleIndex)
      .reduce((acc, { volume }) => acc + volume, 0).toFixed(1);

    const typeWithMostBeers = groupedType.reduce(R.maxBy(([, beers]) => beers.length), ['-', []]);
    const volumeWithMostBeers = groupedVolume.reduce(R.maxBy(([, beers]) => beers.length), ['-', []]);
    const volumeLabel = volumeWithMostBeers[0] !== '-' ? volumes.find(volume => volume.value.toString() === volumeWithMostBeers[0]) : '';
    const mostExpensiveBar = groupedBar
      .map(([bar, beers]) => [bar, R.sum(beers.map(R.prop('price')))])
      .reduce(R.maxBy(([, totalPrice]) => totalPrice), ['-', []]);
    const spentMost = groupedPerson
      .map(([bar, beers]) => [bar, R.sum(beers.map(R.prop('price')))])
      .reduce(R.maxBy(([, totalPrice]) => totalPrice), ['-', []]);

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

    const fullPriceLabel = totalBeerPrice > 750 ? 'Juomiin käytetty yhteensä (vitun juopot)' : 'Juomiin käytetty yhteensä';

    const views = [
      <StatusBlockContainer>
        <StatusBlock
          width="2"
          height="1"
          label="Suosituin juomatyyppi"
          value={`${beerTypes[typeWithMostBeers[0]] || '-'}`}
        />
        <StatusBlock
          width="1"
          height="1"
          label="Suosituin annoskoko"
          value={volumeLabel.name || '-'}
        />
        <StatusBlock
          width="1"
          height="1"
          fontSize="1.5"
          label="Suosituin ravintola"
          value={`${bars[mostExpensiveBar[0]] || '-'} (${Number.parseFloat(mostExpensiveBar[1]).toFixed(2)}€)`}
        />
      </StatusBlockContainer>,
      <StatusBlockContainer>
        <StatusBlock
          width="1"
          height="1"
          label="Juomien kokonaismäärä"
          value={totalBeers}
        />
        <StatusBlock
          width="1"
          height="1"
          label="Juomia juotu yhteensä"
          value={`${totalBeerVolume}l`}
        />
        <StatusBlock
          width="1"
          height="1"
          fontSize="1.5"
          label="Hillopäällikkö"
          value={`${spentMost[0]} (${Number.parseFloat(spentMost[1]).toFixed(2)}€)`}
        />
        <StatusBlock
          width="1"
          height="1"
          label="Amber alea juotu"
          value={`${amberAleVolume}l`}
        />
      </StatusBlockContainer>,
      <StatusBlockContainer>
        <StatusBlock
          width="2"
          height="1"
          label={fullPriceLabel}
          value={`${totalBeerPrice}€`}
        />
        <StatusBlock
          width="2"
          height="1"
          fontSize="1.5"
          label="Kallein juoma"
          value={` 
            ${personWithPriciestBeer.price.toFixed(2)}€ /
            ${personWithPriciestBeer.name} /
            ${personWithPriciestBeer.type}`}
        />
      </StatusBlockContainer>,
    ];

    return <div>{views.map(view => view)}</div>;
  }
}
