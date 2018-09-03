import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import SwipeView from 'components/swipe-view';
import IndexView from 'components/index-view';
import BarView from 'components/bar-view';

import { setCurrentView } from '../actions';
import styles from './app-frame.scss';


const css = classNames.bind(styles);

function AppFrame({ currentView, setCurrentView }) {
  const navOptions = ['etusivu', 'lisää olut'];

  return (
    <div className={css('app-frame')}>
      <div className={css('masthead')}>
        <div className={css('title')} />
        <div className={css('navigation')}>
          {navOptions.map((option, index) => (
            <button
              type="button"
              onClick={() => setCurrentView(index)}
              className={css('nav-option', { active: index === currentView })}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <SwipeView
        views={[
          IndexView,
          BarView,
        ]}
      />
    </div>
  );
}

export default connect(state => ({
  currentView: state.app.currentView,
}), { setCurrentView })(AppFrame);
