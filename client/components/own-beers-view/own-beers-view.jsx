import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './own-beers-view.scss';
import {
  getBars, getBeers, getBeerTypes, getUserId, getToken,
} from '../../selectors';
import { fetchBeers } from '../../actions';
import { deleteBeer } from '../../api';
import BeerListing from '../beer-listing/beer-listing';

const css = classNames.bind(styles);


class OwnBeersView extends React.Component {
  state = {
    isSubmitting: false,
  }

  onDelete = async (beerId) => {
    const { token } = this.props;
    this.setState({ isSubmitting: true });

    await deleteBeer({
      beerId, token,
    });

    await this.props.fetchBeers();

    this.setState({ isSubmitting: false });
  }

  render() {
    const {
      bars, beers, types, id,
    } = this.props;
    const { isSubmitting } = this.state;

    const ownBeers = beers.filter(beer => beer.personId.toString() === id).map(beer => (
      <div className={css('listing')}>
        <BeerListing
          location={bars[beer.barId]}
          beerType={types[beer.typeId]}
          volume={beer.volume}
          abv={beer.abv}
          price={beer.price}
          rating={beer.starRating}
          showRating
          description={beer.review}
          showDescription
        />
        <button type="button" onClick={() => this.onDelete(beer.id)}>
          <img src="/assets/images/delete.png" />
        </button>
      </div>
    ));

    return (
      <div className={css('view')}>
        <h3>Omat juomat</h3>
        <div>
          {R.intersperse(<hr />, ownBeers)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bars: getBars(state),
  beers: getBeers(state),
  types: getBeerTypes(state),
  id: getUserId(state),
  token: getToken(state),
});

const mapDispatchToProps = {
  fetchBeers,
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnBeersView);
