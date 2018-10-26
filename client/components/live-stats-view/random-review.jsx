import React from 'react';
import classNames from 'classnames/bind';
import styles from './random-review.scss';

const css = classNames.bind(styles);

const stars = ['yhden tähden!', 'kaksi tähteä!', 'kolme tähteä!', 'neljä tähteä!', 'viisi tähteä!'];
const adjectives = ['täydellisen', 'vaatimattoman', 'säälittävän', 'upean', 'uskomattoman', 'kohtalaisen', 'erikoisen',
  'kohteliaan', 'järkyttävän', 'selkeän', 'kehitysvammaisen', 'ylistävän', 'tahdikkaan', 'sivistyneen', 'hurmaavan', 'helvetinmoisen', 'kirkkaan',
  'tympeän', 'vittumaisen', 'surkean', 'ylitsevuotavan', 'jyrkän', 'tyrmäävän', 'vammaisen', 'onnettoman', 'saatanan', 'vitun', 'helvetin'];
const verbs = ['sanoi', 'kertoili', 'sanaili', 'runoili', 'kommentoi', 'kirjoitti', 'sepusteli', 'tarinoi', 'raapusteli', 'näppäili', 'aprikoi', 'mietti', 'pohti',
  'tuumaili', 'ajatteli', 'puntaroi', 'fundeerasi', 'pohdiskeli', 'mietiskeli', 'kirjoitteli'];
const adverbs = ['kaihosti', 'väkevästi', 'aurinkoisesti', 'väkivaltaisesti', 'iloisesti', 'surullisesti', 'mahtipontisesti', 'reippaasti', 'kylmäverisesti',
  'hauskasti', 'mukavasti', 'lämpimästi', 'kauniisti', 'väsyneesti', 'yksityiskohtaisesti', 'tavallisesti', 'mieleenpainuvasti', 'kohteliaasti', 'onnettomasti',
  'ilkeästi', 'roisisti', 'selvästi', 'siististi', 'kehitysvammaisesti', 'haltioituneesti', 'erikoisesti', 'sivistyneesti', 'surkeasti', 'vittumaisesti',
  'paskasti', 'urposti', 'vammaisesti', 'aivovammaisesti', 'tympeästi', 'tyrmäävästi', 'onnistuneesti', 'jyrkästi', 'kusipäisesti', 'ivallisesti'];

export default class RandomReview extends React.Component {
  state = {
    reviewText: null,
    reviewerDescription: null,
  }

  newReviewTimeout = null

  componentDidMount() {
    this.newReview();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.beers.length === 0) {
      this.newReview();
    }
  }

  newReview = () => {
    // Reset the timeout if the button was clicked
    window.clearTimeout(this.newReviewTimeout);
    this.newReviewTimeout = window.setTimeout(this.newReview, 15000);

    const { beers, bars, beerTypes } = this.props;

    const beersWithReview = beers.filter(beer => beer.review);

    if (beersWithReview.length === 0) return;

    const randomReview = beersWithReview[Math.floor(Math.random() * beersWithReview.length)];
    const reviewStarStr = stars[randomReview.starRating - 1];
    const reviewAdjectiveStr = adjectives[Math.floor(Math.random() * adjectives.length)];
    const reviewVerbStr = verbs[Math.floor(Math.random() * verbs.length)];
    const reviewAdverbStr = adverbs[Math.floor(Math.random() * adverbs.length)];

    this.setState({
      reviewerDescription: `Näin ${reviewAdjectiveStr} ${reviewAdverbStr} ${reviewVerbStr} ${randomReview.personName} ${beerTypes[randomReview.typeId]} -tyylisestä juomastaan ravintolassa ${bars[randomReview.barId]}.`,
      reviewText: `"${randomReview.review} - Annan juomalle arvosanaksi ${reviewStarStr}"`,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={css('random-review')}>
          <div className={css('review')}>
            {this.state.reviewText}
          </div>
          <div className={css('reviewer')}>
            {this.state.reviewerDescription}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
