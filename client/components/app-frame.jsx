import React from 'react';
import classNames from 'classnames/bind';
import styles from './app-frame.scss';

const css = classNames.bind(styles);

export default function AppFrame({ children }) {
  return (
    <div className={css('app-frame')}>
      <div className={css('masthead')}>
        <div className={css('title')} />
        <div className={css('navigation')} />
      </div>
      {children}
    </div>
  );
}
