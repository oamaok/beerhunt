import { apiCall } from '../api'

export const SET_BEERS = Symbol('SET_BEERS');

function setBeers(beers) {
  return {
    type: SET_BEERS,
    beers,
  }
}

export function fetchBeers() {
  return async (dispatch) => { 
    const beers = await apiCall('beers');
    dispatch(setBeers(beers)); 
  }
}

