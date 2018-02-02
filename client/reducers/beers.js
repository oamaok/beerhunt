import { SET_BEERS } from 'actions/beers'
const initialState = [];

export default function beersReducer(state = initialState, action) {
  switch(action.type) {
    case SET_BEERS:
      return action.beers;
    default:
      return state;
  }
}