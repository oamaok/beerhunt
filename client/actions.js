import { apiCall } from './api';

export const SET_FACEBOOK_STATUS = Symbol('SET_FACEBOOK_STATUS');
export const SET_FACEBOOK_INFO = Symbol('SET_FACEBOOK_INFO');
export const RESET_FACEBOOK_INFO = Symbol('RESET_FACEBOOK_INFO');
export const SET_BEERS = Symbol('SET_BEERS');
export const SET_BARS = Symbol('SET_BARS');
export const SET_BEER_TYPES = Symbol('SET_BEER_TYPES');

export const FACEBOOK_CONNECTED = 'connected'; // Defined by Facebook
export const FACEBOOK_LOADING = 'loading'; // Not defined by Facebook

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

function resetFacebookInformation() {
  return { type: RESET_FACEBOOK_INFO };
}

export function updateFacebookStatus(response) {
  return async (dispatch) => {
    if (response.status === FACEBOOK_CONNECTED) {
      dispatch(setFacebookStatus(FACEBOOK_LOADING));
      dispatch(setFacebookInformation(await new Promise(resolve => FB.api('/me', resolve))));
    } else {
      dispatch(resetFacebookInformation());
    }

    dispatch(setFacebookStatus(response.status));
  };
}

export function refreshFacebookStatus() {
  return async (dispatch) => {
    dispatch(setFacebookStatus(FACEBOOK_LOADING));
    dispatch(updateFacebookStatus(await new Promise(FB.getLoginStatus)));
  };
}

export function connectFacebook() {
  return async (dispatch) => {
    dispatch(setFacebookStatus(FACEBOOK_LOADING));
    dispatch(updateFacebookStatus(await new Promise(FB.login)));
  };
}

export function disconnectFacebook() {
  return async (dispatch) => {
    dispatch(setFacebookStatus(FACEBOOK_LOADING));
    dispatch(updateFacebookStatus(await new Promise(FB.logout)));
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
