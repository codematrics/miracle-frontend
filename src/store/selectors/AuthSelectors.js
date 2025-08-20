export const isAuthenticated = state => {
  // Use the new authSlice isAuthenticated field first, fallback to legacy
  return state.auth.isAuthenticated || Boolean(state.auth.auth.token || state.auth.auth.idToken);
};
