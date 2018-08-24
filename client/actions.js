import { apiCall } from './api';

export const SET_FACEBOOK_STATUS = Symbol('SET_FACEBOOK_STATUS');
export const SET_FACEBOOK_INFO = Symbol('SET_FACEBOOK_INFO');
export const SET_BEERS = Symbol('SET_BEERS');
export const SET_BARS = Symbol('SET_BARS');
export const SET_BEER_TYPES = Symbol('SET_BEER_TYPES');

function setFacebookStatus(status) {
  return {
    type: SET_FACEBOOK_STATUS,
    status,
  };
}

function setFacebookInformation({ name, id }) {
  return {
    type: SET_FACEBOOK_INFO,
    name,
    id,
  };
}

export function updateFacebookStatus(response) {
  return async (dispatch) => {
    if (response.status !== 'connected') {
      dispatch(setFacebookStatus(response.status));
      dispatch(setFacebookInformation(null));

      return;
    }

    const apiResponse = await new Promise(resolve => FB.api('/me', resolve));

    dispatch(setFacebookStatus(response.status));
    dispatch(setFacebookInformation(apiResponse));
  };
}

function setBeers(beers) {
  return {
    type: SET_BEERS,
    beers,
  };
}

export function fetchBeers() {
  return async (dispatch) => {
    const beers = await apiCall('beers');
    dispatch(setBeers(beers));
  };
}

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
  };
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
  };
}
