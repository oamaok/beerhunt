import {
  BEGIN_AUTHENTICATION,
  END_AUTHENTICATION,
  SET_CREDENTIALS,
  CLEAR_CREDENTIALS,
  SET_BEERS,
  SET_BARS,
  SET_BEER_TYPES,
  SET_FACEBOOK_STATUS,
} from './actions';

const initialAppState = {
  beers: [],
  bars: [],
  beerTypes: [],
  facebook: {},
  auth: {
    isLoading: false,
    token: null,
    name: '',
    id: '',
  },
};

export default function ebhReducer(state = initialAppState, action) {
  switch (action.type) {
    case BEGIN_AUTHENTICATION:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
        },
      };
    case END_AUTHENTICATION:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
        },
      };
    case SET_CREDENTIALS:
      localStorage.setItem('ebh_token', action.token);
      return {
        ...state,
        auth: {
          ...state.auth,
          id: action.id,
          name: action.name,
          token: action.token,
        },
      };
    case CLEAR_CREDENTIALS:
      localStorage.removeItem('ebh_token');
      return {
        ...state,
        auth: {
          ...state.auth,
          id: '',
          name: '',
          token: null,
        },
      };
    case SET_FACEBOOK_STATUS: {
      return {
        ...state,
        facebook: action.response,
      };
    }
    case SET_BEERS:
      return {
        ...state,
        beers: action.beers,
      };
    case SET_BARS:
      return {
        ...state,
        bars: action.bars,
      };
    case SET_BEER_TYPES:
      return {
        ...state,
        beerTypes: action.types,
      };
    default:
      return state;
  }
}
