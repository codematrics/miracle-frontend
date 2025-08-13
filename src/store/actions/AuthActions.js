import {
  clearAuthData,
  formatError,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  showErrorMessage,
  signUp,
} from "../../services/AuthService";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";

export function signupAction(username, email, password, navigate) {
  return async (dispatch) => {
    dispatch(loadingToggleAction(true));

    try {
      const response = await signUp(username, email, password);

      if (response.data?.success) {
        const tokenSaved = saveTokenInLocalStorage(response.data);

        if (tokenSaved) {
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate);
          dispatch(confirmedSignupAction(response.data));
          navigate("/dashboard");
        } else {
          throw new Error("Failed to save authentication data");
        }
      } else {
        const errorMessage = formatError(
          response.data || { message: "Signup failed" }
        );
        showErrorMessage(errorMessage);
        dispatch(signupFailedAction(errorMessage));
      }
    } catch (error) {
      const errorMessage = formatError(
        error.response?.data || {
          message: error.message || "Network error occurred",
        }
      );
      showErrorMessage(errorMessage);
      dispatch(signupFailedAction(errorMessage));
    } finally {
      dispatch(loadingToggleAction(false));
    }
  };
}

export function Logout(navigate) {
  return (dispatch) => {
    try {
      clearAuthData();
      dispatch({ type: LOGOUT_ACTION });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch({ type: LOGOUT_ACTION });
      navigate("/login");
    }
  };
}

export function loginAction(email, password, navigate) {
  return async (dispatch) => {
    dispatch(loadingToggleAction(true));

    try {
      const response = await login(email, password);

      if (response.data?.success) {
        const tokenSaved = saveTokenInLocalStorage(response.data);

        if (tokenSaved) {
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate);
          dispatch(loginConfirmedAction(response.data));
          navigate("/dashboard");
        } else {
          throw new Error("Failed to save authentication data");
        }
      } else {
        const errorMessage = formatError(
          response.data || { message: "Login failed" }
        );
        showErrorMessage(errorMessage);
        dispatch(loginFailedAction(errorMessage));
      }
    } catch (error) {
      const errorMessage = formatError(
        error.response?.data || {
          message: error.message || "Network error occurred",
        }
      );
      showErrorMessage(errorMessage);
      dispatch(loginFailedAction(errorMessage));
    } finally {
      dispatch(loadingToggleAction(false));
    }
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
