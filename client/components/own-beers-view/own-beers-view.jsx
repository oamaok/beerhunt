import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '../add-beer-view/add-beer-view'; // TODO using addbeer, make own
import {
  getBars, getBeers, getBeerTypes, getUserId, getToken,
} from '../../selectors';
import { fetchBeers } from '../../actions';
import { deleteBeer } from '../../api';

const css = classNames.bind(styles);


class OwnBeersView extends React.Component {
  state = {
    isSubmitting: false,
  }

  onDelete = async (rowid) => {
    const { token } = this.props;
    this.setState({ isSubmitting: true });

    await deleteBeer({
      beerId: rowid, token,
    });

    await this.props.fetchBeers();

    this.setState({ isSubmitting: false });
  }

  render() {
    const {
      bars, beers, types, id,
    } = this.props;
    const { isSubmitting } = this.state;

    return (
      <div className={css('view')}>
        <h3>My drinks</h3>
        <div>
          <ol>
            {beers.filter(beer => beer.personId.toString() === id)
              .map(({
                barId, typeId, volume, abv, rowid, review,
              }) => (
                <li>{bars[barId]} / {types[typeId]} / {volume}l / {abv}%
                  <button type="button" className={css('submit')} onClick={() => this.onDelete(rowid)} disabled={isSubmitting}>
                    Remove
                  </button>
                  {review != ''
                    ? (
                      <ul>
                        <li>{review}</li>
                      </ul>
                    ) : null
                  }
                </li>
              ))}
          </ol>
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
