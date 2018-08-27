import { apiCall } from './api';

export const BEGIN_AUTHENTICATION = Symbol('BEGIN_AUTHENTICATION');
export const END_AUTHENTICATION = Symbol('END_AUTHENTICATION');
export const SET_CREDENTIALS = Symbol('SET_CREDENTIALS');
export const CLEAR_CREDENTIALS = Symbol('CLEAR_CREDENTIALS');

export const SET_BEERS = Symbol('SET_BEERS');
export const SET_BARS = Symbol('SET_BARS');
export const SET_BEER_TYPES = Symbol('SET_BEER_TYPES');

export const FACEBOOK_CONNECTED = 'connected';
export const FACEBOOK_NOT_AUTHORIZED = 'not_authorized';
export const FACEBOOK_UNKNOWN = 'unknown';

const baseAction = type => ({ type });

function setCredentials({ token, name = '', id  = ''}) {
  return {
    type: SET_CREDENTIALS,
    token,
    name,
    id,
  };
}

function updateAuthStatus(response) {
  return async (dispatch) => {
    if (response.status === FACEBOOK_CONNECTED) {
      const authResponse = await apiCall('auth', {
        method: 'POST',
        body: JSON.stringify({
          accessToken: response.authResponse.accessToken,
        }),
      });

      // TODO: Error handling

      dispatch(setCredentials(authResponse));
    } else {
      dispatch(baseAction(CLEAR_CREDENTIALS));
    }

    dispatch(baseAction(END_AUTHENTICATION));
  };
}

export function validateToken(token) {
  return async (dispatch) => {
    dispatch(baseAction(BEGIN_AUTHENTICATION));

    const authResponse = await apiCall('validate', {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });

    if (authResponse.status === 'success') {
      dispatch(setCredentials(authResponse));
    } else {
      dispatch(baseAction(CLEAR_CREDENTIALS));
    }

    dispatch(baseAction(END_AUTHENTICATION));
  };
}

export function refreshFacebookStatus() {
  return async (dispatch) => {
    dispatch(baseAction(BEGIN_AUTHENTICATION));
    dispatch(updateAuthStatus(await new Promise(FB.getLoginStatus)));
  };
}

export function connectFacebook() {
  return async (dispatch) => {
    dispatch(baseAction(BEGIN_AUTHENTICATION));
    dispatch(updateAuthStatus(await new Promise(FB.login)));
  };
}

export function disconnectFacebook() {
  return async (dispatch) => {
    dispatch(baseAction(BEGIN_AUTHENTICATION));
    dispatch(updateAuthStatus(await new Promise(FB.logout)));
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
