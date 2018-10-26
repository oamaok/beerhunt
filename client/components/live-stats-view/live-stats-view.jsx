import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { getBars, getBeers, getBeerTypes } from '../../selectors';
import styles from './live-stats-view.scss';

import BeerListing from '../beer-listing/beer-listing';

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
        rating={beer.starRating}
        showRating
        personName={beer.personName}
        personId={beer.personId}
      />
    ));

  const totalBeers = beers.length;
  const totalBeerVolume = beers.reduce((acc, { volume }) => acc + volume, 0).toFixed(2);
  const totalBeerPrice = beers.reduce((acc, { price }) => acc + price, 0).toFixed(2);
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

  const beersWithReview = beers.filter(beer => beer.review);
  const randomReview = beersWithReview[Math.floor(Math.random() * beersWithReview.length)];
  const reviewStarStr = randomReview ? stars[randomReview.starRating - 1] : null;
  const reviewAdjectiveStr = adjectives[Math.floor(Math.random() * adjectives.length)];
  const reviewVerbStr = verbs[Math.floor(Math.random() * verbs.length)];
  const reviewAdverbStr = adverbs[Math.floor(Math.random() * adverbs.length)];

  const fullPriceLabel = totalBeerPrice > 1000 ? 'Kokonaishinta (v***n juopot)' : 'Kokonaishinta';

  return (
    <div>
      <h1>Live-tulokset</h1>
      <div className={css('status-blocks')}>
        {typeWithMostBeers[0] !== '-'
          ? <StatusBlock width="1" height="1" label="Suosituin juomatyyppi" value={`${beerTypes[typeWithMostBeers[0]]}`} /> : null
        }
        <StatusBlock width="1" height="1" label="Juotuja juomia yhteensä (kpl)" value={totalBeers} />
        <StatusBlock width="1" height="1" label="Kokonaismäärä" value={`${totalBeerVolume}l`} />
        <StatusBlock width="1" height="1" label={fullPriceLabel} value={`${totalBeerPrice}€`} />
        {randomReview
          ? (
            <StatusBlock
              width="2"
              height="1"
              label={`Näin ${reviewAdjectiveStr} ${reviewAdverbStr} ${reviewVerbStr} ${randomReview.personName} ${beerTypes[randomReview.typeId]}
              -tyylisestä juomastaan paikassa: ${bars[randomReview.barId]}`}
              value={`
              "${randomReview.review} - Annan juomalle arvosanaksi ${reviewStarStr}"`}
            />
          ) : null
        }
        {personWithMostBeers[0] !== '-'
          ? <StatusBlock width="2" height="1" label="Eniten juotuja juomia" value={`${personWithMostBeers[0]} - ${personWithMostBeers[1].length}`} /> : null
        }
        {personWithPriciestBeer.name !== '-'
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
