const initialState = {
  isAuthenticated: false,
  userId: '',
  name: '',
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}