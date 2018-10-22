import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '../add-beer-view/add-beer-view'; // TODO using addbeer, make own
import { getBars, getBeers, getBeerTypes, getUserId, getToken } from '../../selectors';
import { setCurrentView } from '../../actions';
import { deleteBeer } from '../../api';

const css = classNames.bind(styles);


class OwnBeersView extends React.Component {

  state = {
    isSubmitting: false,
  }

  onDelete = (rowid) => {
    const { token } = this.props;
    this.setState({ isSubmitting: true });

    deleteBeer({
      rowid, token,
    }).then(() => {
      this.setState({ isSubmitting: false });
      this.props.setCurrentView(1);
    });
  }

  render() {
    const { bars, beers, types, id } = this.props;
    const { isSubmitting, } = this.state;

    return (
      <div className={css('view')}>
        <h3>Omat oluesi</h3>
        <div>
          <ol>
            {beers.filter(beer => beer.personId.toString() === id)
              .map(({barId, typeId, volume, abv, rowid}) =>
                <li>{bars[barId]}: {types[typeId]}, {volume}l, {abv}%
                  <button type="button" className={css('submit')} onClick={() => this.onDelete(rowid)} disabled={isSubmitting}>
                    Poista
                  </button>
                </li>)}
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
  setCurrentView,
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnBeersView);

