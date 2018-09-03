import { Record } from 'immutable';

import {
  BEGIN_AUTHENTICATION,
  END_AUTHENTICATION,
  SET_CREDENTIALS,
  CLEAR_CREDENTIALS,
  FACEBOOK_LOADED,
  SET_BEERS,
  SET_BARS,
  SET_BEER_TYPES,
  SET_FACEBOOK_STATUS,
} from './actions';

const AuthState = Record({
  isLoading: false,
  token: '',
  name: '',
  id: '',
}, 'AuthState');

const AppState = Record({
  beers: [],
  bars: [],
  beerTypes: [],
  facebookLoaded: false,
  facebook: {},
  auth: new AuthState(),
}, 'AppState');

const initialAppState = new AppState();

export default function ebhReducer(state = initialAppState, action) {
  switch (action.type) {
    case BEGIN_AUTHENTICATION:
      return state.setIn(['auth', 'isLoading'], true);
    case END_AUTHENTICATION:
      return state.setIn(['auth', 'isLoading'], false);
    case SET_CREDENTIALS:
      return state.update('auth', authState => authState.merge({
        id: action.id,
        name: action.name,
        token: action.token,
      }));
    case CLEAR_CREDENTIALS:
      return state.update('auth', authState => authState.merge({
        id: '',
        name: '',
        token: '',
      }));
    case FACEBOOK_LOADED:
      return state.set('facebookLoaded', true);
    case SET_FACEBOOK_STATUS:
      return state.set('facebook', action.response);
    case SET_BEERS:
      return state.set('beers', action.beers);
    case SET_BARS:
      return state.set('bars', action.bars);
    case SET_BEER_TYPES:
      return state.set('beerTypes', action.types);
    default:
      return state;
  }
}
