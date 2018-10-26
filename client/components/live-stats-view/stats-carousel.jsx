import React from 'react';
import * as R from 'ramda';
import classNames from 'classnames/bind';
import styles from './stats-carousel.scss';

const css = classNames.bind(styles);

const stars = ['yhden tähden!', 'kaksi tähteä!', 'kolme tähteä!', 'neljä tähteä!', 'viisi tähteä!'];
const adjectives = ['täydellisen', 'vaatimattoman', 'säälittävän', 'upean', 'uskomattoman', 'kohtalaisen', 'erikoisen',
  'kohteliaan', 'järkyttävän', 'selkeän', 'kehitysvammaisen', 'ylistävän', 'tahdikkaan', 'sivistyneen', 'hurmaavan', 'helvetinmoisen', 'kirkkaan',
  'tympeän', 'vittumaisen', 'surkean', 'ylitsevuotavan', 'jyrkän', 'tyrmäävän', 'vammaisen', 'onnettoman', 'saatanan', 'vitun', 'helvetin'];
const verbs = ['sanoi', 'kertoili', 'sanaili', 'runoili', 'kommentoi', 'kirjoitti', 'sepusteli', 'tarinoi', 'raapusteli', 'näppäili', 'aprikoi', 'mietti', 'pohti',
  'tuumaili', 'ajatteli', 'puntaroi', 'fundeerasi', 'pohdiskeli', 'mietiskeli', 'kirjoitteli'];
const adverbs = ['kaihosti', 'väkevästi', 'aurinkoisesti', 'väkivaltaisesti', 'iloisesti', 'surullisesti', 'mahtipontisesti', 'reippaasti', 'kylmäverisesti',
  'hauskasti', 'mukavasti', 'lämpimästi', 'kauniisti', 'väsyneesti', 'yksityiskohtaisesti', 'tavallisesti', 'mieleenpainuvasti', 'kohteliaasti', 'onnettomasti',
  'ilkeästi', 'roisisti', 'selvästi', 'siististi', 'kehitysvammaisesti', 'haltioituneesti', 'erikoisesti', 'sivistyneesti', 'surkeasti', 'vittumaisesti',
  'paskasti', 'urposti', 'vammaisesti', 'aivovammaisesti', 'tympeästi', 'tyrmäävästi', 'onnistuneesti', 'jyrkästi', 'kusipäisesti', 'ivallisesti'];

function StatusBlock({
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

function StatusBlockContainer({ children }) {
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

    const amberAleIndex = beerTypes.indexOf('Amber ale');

    const amberAleVolume = beers.filter(beer => beer.typeId === amberAleIndex).reduce((acc, { volume }) => acc + volume, 0).toFixed(1);

    const personWithMostBeers = groupedPerson.reduce(R.maxBy(([, beers]) => beers.length), ['-', []]);
    const typeWithMostBeers = groupedType.reduce(R.maxBy(([, beers]) => beers.length), ['-', []]);
    const mostExpensiveBar = groupedBar
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

    const fullPriceLabel = totalBeerPrice > 1000 ? 'Kokonaishinta (vitun juopot)' : 'Kokonaishinta';


    const views = [
      <StatusBlockContainer>
        <StatusBlock
          width="1"
          height="1"
          label="Kumottua lasia"
          value={totalBeers}
        />
        <StatusBlock
          width="1"
          height="1"
          label="Olutta yhteensä"
          value={`${totalBeerVolume}l`}
        />
        <StatusBlock
          width="2"
          height="1"
          label="Suosituin juomatyyppi"
          value={`${beerTypes[typeWithMostBeers[0]]}`}
        />
      </StatusBlockContainer>,

      <StatusBlockContainer>
        <StatusBlock
          width="1"
          height="1"
          label={fullPriceLabel}
          value={`${totalBeerPrice}€`}
        />
        <StatusBlock

          width="1"
          height="1"
          label="Amber alea juotu"
          value={`${amberAleVolume}l`}
        />
        <StatusBlock
          width="2"
          height="1"
          fontSize="1.5"
          label="Eniten juotuja juomia"
          value={`${personWithMostBeers[0]} (${personWithMostBeers[1].length})`}
        />
      </StatusBlockContainer>,


      <StatusBlockContainer>
        <StatusBlock
          width="2"
          height="1"
          fontSize="1.5"
          label="Parhaiten myynyt ravintola"
          value={`${bars[mostExpensiveBar[0]]} (${mostExpensiveBar[1]}€)`}
        />
        <StatusBlock
          width="2"
          height="1"
          fontSize="1.5"
          label="Kallein juoma"
          value={` 
            ${personWithPriciestBeer.price}€ /
            ${personWithPriciestBeer.name} /
            ${personWithPriciestBeer.type}`}
        />

      </StatusBlockContainer>,
    ];

    return <div>{views.map(view => view)}</div>;
  }
}
