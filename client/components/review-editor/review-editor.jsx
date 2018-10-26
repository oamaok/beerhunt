import React from 'react';
import { range } from 'ramda';
import classNames from 'classnames/bind';
import styles from './review-editor.scss';

const css = classNames.bind(styles);

export default class ReviewEditor extends React.Component {
  state = {
    starRating: 0,
    review: '',
  }

  onSubmit = (evt) => {
    evt.preventDefault();

    this.props.onSubmit(this.state);
  }

  selectRating = star => this.setState({ starRating: star })

  handleReviewChange = evt => this.setState({ review: evt.target.value })

  render() {
    const { starRating, review } = this.state;

    const submitDisabled = starRating === 0 || review.length === 0;

    return (
      <form onSubmit={this.onSubmit} className={css('review-editor')}>
        <h1>Olut lisätty!</h1>
        <div>Halutessasi voit myös antaa oluelle arvostelun ja yhdestä viiteen tähteä.</div>
        <div className={css('star-rating')}>
          {range(1, 6).map(star => (
            <button
              key={star}
              type="button"
              onClick={() => this.selectRating(star)}
              className={css('star')}
            >
              <img
                alt=""
                src={starRating >= star ? '/assets/images/star.png' : '/assets/images/star-outline.png'}
              />
            </button>
          ))}
        </div>
        <textarea onChange={this.handleReviewChange} placeholder="Olut oli mielestäni..." />
        <button type="submit" disabled={submitDisabled}>Lisää arvostelu</button>
        <button className={css('secondary')} type="button" onClick={this.props.backToStats}>Etusivu</button>
      </form>
    );
  }
}
