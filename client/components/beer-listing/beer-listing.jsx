import React from 'react';
import classNames from 'classnames/bind';
import styles from './beer-listing.scss';

const css = classNames.bind(styles);

export default function BeerListing({
  beerType, volume, abv, location, rating, descripiton,
}) {
  return (
    <div className={css('beer-listing')}>
      <div className={css('essentials')}>
        <span>{beerType}</span> / <span>{volume}l</span> / <span>{abv}%</span>
      </div>
      <div className={css('location')}>{location}</div>
    </div>
  );
}
