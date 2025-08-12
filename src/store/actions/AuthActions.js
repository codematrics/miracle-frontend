import {
  formatError,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  signUp,
} from "../../services/AuthService";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";

export function signupAction(email, password, navigate) {
  return (dispatch) => {
    signUp(email, password)
      .then((response) => {
        if (response.data.success) {
          saveTokenInLocalStorage(response.data);
          runLogoutTimer(
            dispatch,
            7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            navigate
          );
          dispatch(confirmedSignupAction(response.data));
          navigate("/dashboard");
        } else {
          const errorMessage = formatError(response.data);
          dispatch(signupFailedAction(errorMessage));
        }
      })
      .catch((error) => {
        const errorMessage = formatError(error.response?.data || { message: 'Network error' });
        dispatch(signupFailedAction(errorMessage));
      });
  };
}

export function Logout(navigate) {
  localStorage.removeItem("userDetails");
  navigate("/login");
  //history.push('/login');

  return {
    type: LOGOUT_ACTION,
  };
}

export function loginAction(email, password, navigate) {
  return (dispatch) => {
    login(email, password)
      .then((response) => {
        if (response.data.success) {
          saveTokenInLocalStorage(response.data);
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate); // 7 days in milliseconds
          dispatch(loginConfirmedAction(response.data));
          navigate("/dashboard");
        } else {
          const errorMessage = formatError(response.data);
          dispatch(loginFailedAction(errorMessage));
        }
      })
      .catch((error) => {
        const errorMessage = formatError(error.response?.data || { message: 'Network error' });
        dispatch(loginFailedAction(errorMessage));
      });
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(data) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
    payload: data,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}
