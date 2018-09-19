import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { ViewContainer, OwnBeersView, LiveStatsView, AddBeerView } from 'components'

import { setCurrentView } from '../../actions';
import styles from './app-frame.scss';


const css = classNames.bind(styles);

function AppFrame({ currentView, setCurrentView }) {
  const navOptions = ['omat oluet', 'live stats', 'lisää olut'];

  return (
    <div className={css('app-frame')}>
      <div className={css('masthead')}>
        <div className={css('title')}>hbh</div>
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
      <ViewContainer
        views={[
          OwnBeersView,
          LiveStatsView,
          AddBeerView,
        ]}
      />
    </div>
  );
}

export default connect(state => ({
  currentView: state.app.currentView,
}), { setCurrentView })(AppFrame);
