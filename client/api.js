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

export async function addBeer({
  type, volume, abv, bar, name, facebookId,
}) {
  await apiCall('beer', {
    method: 'POST',
    body: JSON.stringify({
      beerType: parseInt(type),
      volume,
      abv: isNaN(parseFloat(abv)) ? 0 : parseFloat(abv),
      name,
      facebookId,
      bar: parseInt(bar),
    }),
  });
}
