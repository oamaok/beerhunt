import React from 'react';
import classNames from 'classnames/bind';
import styles from './live-stats-view.scss';

import BeerListing from '../beer-listing/beer-listing';

const css = classNames.bind(styles);

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


export default function LiveStatsView() {
  return (
    <div>
      <h1>Live-tulokset</h1>
      <div className={css('status-blocks')}>
        <StatusBlock width="1" height="1" label="Juotuja oluita" value={200} />
        <StatusBlock width="1" height="1" label="Juotuja oluita" value={200} />
        <StatusBlock width="2" height="1" label="Juotuja oluita" value={200} />
      </div>

      <h3>Viisi viimeisintä</h3>
      <div className={css('latest-beers-list')} />
    </div>
  );
}
