import React from 'react';
import classNames from 'classnames/bind';
import styles from './add-beer-view.scss';

const css = classNames.bind(styles);

export default function AddBeerView() {
  return (
    <div>
      <h3>Lisää olut</h3>
      <div className={css('input-group')}>
        <div className={css('icon')}></div>
        <label>Missä baarissa ostit?</label>
        <select></select>
      </div>
      <div className={css('input-group')}>
        <div className={css('icon')}></div>
        <label>Minkälaista ostit?</label>
        <select></select>
      </div>
      <div className={css('input-group')}>
        <div className={css('icon')}></div>
        <label>Kuinka ison ostit?</label>
        <select></select>
      </div>
      <div className={css('input-group')}>
        <div className={css('icon')}></div>
        <label>Kuinka vahvaa se on?</label>
        <input />
      </div>
    </div>
  );
}
