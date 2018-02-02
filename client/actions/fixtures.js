import { apiCall } from '../api';

export const SET_BARS = Symbol('SET_BARS');
export const SET_BEER_TYPES = Symbol('SET_BEER_TYPES');

function setBars(bars) {
  return {
    type: SET_BARS,
    bars,
  };
}

export function fetchBars() {
  return async (dispatch) => { 
    const bars = await apiCall('bars');
    dispatch(setBars(bars)); 
  }
}

function setBeerTypes(types) {
  return {
    type: SET_BEER_TYPES,
    types,
  };
}

export function fetchBeerTypes() {
  return async (dispatch) => { 
    const types = await apiCall('types');
    dispatch(setBeerTypes(types)); 
  }
}
