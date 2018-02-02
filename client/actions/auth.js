export const SET_NAME = Symbol('SET_NAME');

export function setName(name) {
  return {
    type: SET_NAME,
    name,
  }
}