import * as R from 'ramda';

export function apiCall(path, options = {}) {
  return fetch(`/api/${path}`, R.mergeAll([
    { method: 'GET' },
    options,
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  ])).then(res => res.json());
}