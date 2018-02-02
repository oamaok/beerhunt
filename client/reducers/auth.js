import { SET_NAME } from 'actions/auth'

const initialState = {
  hasAuthenticated: false,
  name: '',
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case SET_NAME:
      localStorage.setItem('ebh-name', action.name);
      return {
        name: action.name,
        hasAuthenticated: true,
      }
    default:
      return state;
  }
}