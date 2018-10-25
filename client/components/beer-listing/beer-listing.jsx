import React from 'react';
import classNames from 'classnames/bind';
import styles from './beer-listing.scss';

const css = classNames.bind(styles);

export default function BeerListing({
  beerType, volume, abv, price, location, personName, personId, rating, description,
}) {
  return (
    <div className={css('beer-listing')}>
      {personName ? (
        <div className={css('person')}>
          <img src={`http://graph.facebook.com/${personId}/picture?type=square`} alt="" />
          {personName}
        </div>
      ) : null}
      <div className={css('essentials')}>{beerType} / {volume}l / {abv}% / {price}€
      </div>
      <div className={css('location')}>
        <img src="/assets/images/location-marker.png" alt="" />
        {location}
      </div>
    </div>
  );
}
