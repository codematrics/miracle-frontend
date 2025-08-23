import {
  clearAuthData,
  formatError,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  showErrorMessage,
  signUp,
} from '../../services/AuthService';
import {
  loadingToggle,
  loginConfirmed,
  loginFailed,
  logout as logoutAction,
  signupConfirmed,
  signupFailed,
} from '../slices/authSlice';

export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function signupAction(username, email, password, navigate) {
  return async dispatch => {
    dispatch(loadingToggle(true));

    try {
      const response = await signUp(username, email, password);

      if (response.data?.success) {
        const tokenSaved = saveTokenInLocalStorage(response.data);

        if (tokenSaved) {
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate);
          dispatch(signupConfirmed(response.data));

          // Add small delay to ensure Redux state is updated before navigation
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        } else {
          throw new Error('Failed to save authentication data');
        }
      } else {
        const errorMessage = formatError(response.data || { message: 'Signup failed' });
        showErrorMessage(errorMessage);
        dispatch(signupFailed(errorMessage));
      }
    } catch (error) {
      const errorMessage = formatError(
        error.response?.data || {
          message: error.message || 'Network error occurred',
        }
      );
      showErrorMessage(errorMessage);
      dispatch(signupFailed(errorMessage));
    } finally {
      dispatch(loadingToggle(false));
    }
  };
}

export function Logout(navigate) {
  return dispatch => {
    try {
      clearAuthData();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch(logoutAction());
      navigate('/login');
    }
  };
}

export function loginAction(email, password, navigate) {
  return async dispatch => {
    dispatch(loadingToggle(true));

    try {
      const response = await login(email, password);

      if (response?.data?.status) {
        const tokenSaved = saveTokenInLocalStorage(response?.data?.data);

        if (tokenSaved) {
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate);
          dispatch(loginConfirmed(response?.data?.data));

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        } else {
          throw new Error('Failed to save authentication data');
        }
      } else {
        const errorMessage = formatError(response.data?.message || { message: 'Login failed' });
        showErrorMessage(errorMessage);
        dispatch(loginFailed(errorMessage));
      }
    } catch (error) {
      const errorMessage = formatError(
        error.response?.message || {
          message: error.message || 'Network error occurred',
        }
      );
      showErrorMessage(errorMessage);
      dispatch(loginFailed(errorMessage));
    } finally {
      dispatch(loadingToggle(false));
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
