export const isAuthenticated = (state) => {
    if (state.auth.auth.token || state.auth.auth.idToken) return true;
    return false;
};
