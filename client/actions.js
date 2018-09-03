import { apiCall } from './api';

export const BEGIN_AUTHENTICATION = Symbol('BEGIN_AUTHENTICATION');
export const END_AUTHENTICATION = Symbol('END_AUTHENTICATION');
export const SET_CREDENTIALS = Symbol('SET_CREDENTIALS');
export const CLEAR_CREDENTIALS = Symbol('CLEAR_CREDENTIALS');

export const SET_BEERS = Symbol('SET_BEERS');
export const SET_BARS = Symbol('SET_BARS');
export const SET_BEER_TYPES = Symbol('SET_BEER_TYPES');

export const SET_FACEBOOK_STATUS = Symbol('SET_FACEBOOK_STATUS');
export const FACEBOOK_LOADED = Symbol('FACEBOOK_LOADED');
export const FACEBOOK_CONNECTED = 'connected';
export const FACEBOOK_NOT_AUTHORIZED = 'not_authorized';
export const FACEBOOK_UNKNOWN = 'unknown';

const createAction = (type, data = {}) => ({ type, ...data });

function setFacebookStatus(response) {
  return createAction(FACEBOOK_LOADED, { response });
}

export function facebookLoaded() {
  return createAction(FACEBOOK_LOADED);
}

function setCredentials({ token, name = '', id = '' }) {
  localStorage.setItem('ebh_token', token);

  return createAction(SET_CREDENTIALS, {
    token,
    name,
    id,
  });
}

export function clearCredentials() {
  localStorage.removeItem('ebh_token');

  return createAction(CLEAR_CREDENTIALS);
}

export function validateToken(token) {
  return async (dispatch) => {
    dispatch(createAction(BEGIN_AUTHENTICATION));

    const authResponse = await apiCall('validate', {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });

    if (authResponse.status === 'success') {
      dispatch(setCredentials(authResponse));
    } else {
      dispatch(clearCredentials());
    }

    dispatch(createAction(END_AUTHENTICATION));
  };
}

export function loginWithFacebook() {
  return async (dispatch) => {
    dispatch(createAction(BEGIN_AUTHENTICATION));

    const response = await new Promise(FB.login);
    dispatch(setFacebookStatus(response));

    if (response.status === FACEBOOK_CONNECTED) {
      // TODO: Error handling
      const authResponse = await apiCall('auth', {
        method: 'POST',
        body: JSON.stringify({
          accessToken: response.authResponse.accessToken,
        }),
      });

      dispatch(setCredentials(authResponse));
      dispatch(setFacebookStatus(await new Promise(FB.logout)));
    } else {
      dispatch(clearCredentials());
    }

    dispatch(createAction(END_AUTHENTICATION));
  };
}

function setBeers(beers) {
  return createAction(SET_BEERS, { beers });
}

export function fetchBeers() {
  return async (dispatch) => {
    const beers = await apiCall('beers');
    dispatch(setBeers(beers));
  };
}

function setBars(bars) {
  return createAction(SET_BARS, { bars });
}

export function fetchBars() {
  return async (dispatch) => {
    const bars = await apiCall('bars');
    dispatch(setBars(bars));
  };
}

function setBeerTypes(types) {
  return createAction(SET_BEER_TYPES, { types });
}

export function fetchBeerTypes() {
  return async (dispatch) => {
    const types = await apiCall('types');
    dispatch(setBeerTypes(types));
  };
}
