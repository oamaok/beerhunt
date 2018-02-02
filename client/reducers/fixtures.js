import { SET_BARS, SET_BEER_TYPES } from 'actions/fixtures'

const initialState = {
  bars: [],
  beerTypes: [],
}

export default function fixturesReducer(state = initialState, action) {
  switch(action.type) {
    case SET_BARS:
      return {
        ...state,
        bars: action.bars,
      }
    case SET_BEER_TYPES:
      return {
        ...state,
        beerTypes: action.types,
      }
    default:
      return state;
  }
}