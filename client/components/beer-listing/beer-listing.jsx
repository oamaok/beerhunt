import React from 'react';
import classNames from 'classnames/bind';
import { range } from 'ramda';
import styles from './beer-listing.scss';

const css = classNames.bind(styles);

export default function BeerListing({
  beerType, volume, abv, price, location, personName, personId, 
  rating, showRating = false, description, showDescription = false,
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
      {showRating && rating > 0
        ? (
          <div className={css('star-rating')}>
            {range(1, 6).map(star => (
              <img
                alt=""
                src={rating >= star ? '/assets/images/star.png' : '/assets/images/star-outline.png'}
                className={css('star')}
              />
            ))}
          </div>
        ) : null
      }
      <div className={css('location')}>
        <img src="/assets/images/location-marker.png" alt="" />
        {location}
      </div>
      { showDescription && description !== ''
        ?
          <div className={css('description')}>
            {`"${description}"`}
          </div> : null
      }
    </div>
  );
}
