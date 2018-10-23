import React from 'react';
import classNames from 'classnames/bind';
import styles from './beer-listing.scss';

const css = classNames.bind(styles);

export default function BeerListing({
  bar, beerType, volume, abv, location, rating, description,
}) {
  return (
    <div className={css('beer-listing')}>
      <div className={css('essentials')}>
        <span>{bar}</span> / 
        <span>{beerType}</span> / 
        <span>{volume}l</span> / 
        <span>{abv}%</span>
        <br />
        <span>{description}</span>
      </div>
      <div className={css('location')}>{location}</div>
    </div>
  );
}
