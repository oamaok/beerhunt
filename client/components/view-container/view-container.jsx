import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { nextView, previousView } from '../../actions';
import styles from './view-container.scss';

const css = classNames.bind(styles);

const getTouchCoordinates = evt => ({
  x: evt.touches[0].clientX,
  y: evt.touches[0].clientY,
});

const DELTA_THRESHOLD = 20;
const VELOCITY_THRESHOLD = 15;

class ViewContainer extends React.Component {
  state = {
    dragging: false,
    offset: 0,
  }

  animationFrame = null;
  dragging = false;
  startTime = 0;
  startPosition = { x: 0, y: 0 };
  lastPosition = { x: 0, y: 0 };

  onTouchStart = (evt) => {
    this.setState({ dragging: true });
    this.startPosition = getTouchCoordinates(evt);
    this.lastPosition = getTouchCoordinates(evt);
    this.startTime = new Date().getTime();
  }

  onTouchMove = (evt) => {
    this.lastPosition = getTouchCoordinates(evt);

    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = window.requestAnimationFrame(() => {
      // NOTE: This might fire after the touch has ended
      // so better to have a guard here.
      if (!this.state.dragging) return;

      // NOTE: React re-uses synthetic events, so don't use the `evt` in here
      // as it might be nullified or pointing to some other event.
      const offset = (this.startPosition.x - this.lastPosition.x) / window.innerWidth;

      this.setState({
        offset,
      });
    });
  }

  onTouchEnd = () => {
    if (!this.state.dragging) return;
    this.setState({ dragging: false, offset: 0 });

    const scalar = 1 / window.innerWidth * 100;
    const deltaX = (this.lastPosition.x - this.startPosition.x) * scalar;
    const deltaY = (this.lastPosition.y - this.startPosition.y) * scalar;
    const velX = deltaX / (new Date().getTime() - this.startTime) * 100;

    const { isFirstView, isLastView } = this.props;

    // If the vertical movement exceeds the horizontal, do nothing to avoid
    // swipes when scrolling.
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (deltaX > DELTA_THRESHOLD || velX > VELOCITY_THRESHOLD) {
      if (!isFirstView) this.props.previousView();
    }

    if (deltaX < -DELTA_THRESHOLD || velX < -VELOCITY_THRESHOLD) {
      if (!isLastView) this.props.nextView();
    }
  }

  render() {
    const { views, currentView } = this.props;
    const { dragging, offset } = this.state;

    const negativeLeftOffset = Math.min(
      (offset * 100 + currentView * 100),
      (views.length - 1) * 100,
    );

    const offsetStyle = {
      left: `-${negativeLeftOffset}vw`,
    };

    return (
      <div
        className={css('swipe-view')}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        <div
          className={css('view-wrapper', { dragging })}
          style={offsetStyle}
        >
          {views.map((Component, index) => (
            <div className={css('view-container')} key={index}>
              <Component active={index === currentView} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}


export default connect((state, ownProps) => ({
  currentView: state.app.currentView,
  isLastView: state.app.currentView === ownProps.views.length - 1,
  isFirstView: state.app.currentView === 0,
}), { nextView, previousView })(ViewContainer);
