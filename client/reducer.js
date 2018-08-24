import {
  SET_PERSON_NAME, SET_BEERS, SET_BARS, SET_BEER_TYPES,
} from './actions';

const initialAppState = {
  hasAuthenticated: false,
  name: '',
  beers: [],
  bars: [],
  beerTypes: [],
};

export default function ebhReducer(state = initialAppState, action) {
  switch (action.type) {
    case SET_PERSON_NAME:
      localStorage.setItem('ebh-name', action.name);
      return {
        ...state,
        name: action.name,
        hasAuthenticated: true,
      };
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
