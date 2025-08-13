import axios from "axios";
import Swal from "sweetalert2";
import { loginConfirmedAction, Logout } from "../store/actions/AuthActions";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "userDetails";
const TOKEN_EXPIRY_DAYS = 7;

export function signUp(username, email, password) {
  const postData = {
    username,
    email,
    password,
  };
  return axios.post(`${API_URL}/auth/signup`, postData);
}

export function login(email, password) {
  const postData = {
    email,
    password,
  };

  return axios.post(`${API_URL}/auth/login`, postData);
}

export function formatError(errorResponse) {
  const message = errorResponse.message || "An error occurred";
  return message;
}

export function showErrorMessage(message) {
  Swal.fire({
    icon: "error",
    title: "Authentication Error",
    text: message,
    confirmButtonText: "OK",
  });
}

export function saveTokenInLocalStorage(tokenDetails) {
  if (!tokenDetails.token || !tokenDetails.user) {
    console.error("Invalid token details provided");
    return false;
  }

  try {
    const expireDate = new Date(
      Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    const userDetails = {
      token: tokenDetails.token,
      user: {
        id: tokenDetails.user.id,
        username: tokenDetails.user.username,
        email: tokenDetails.user.email,
      },
      expireDate: expireDate.toISOString(),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(TOKEN_KEY, JSON.stringify(userDetails));
    return true;
  } catch (error) {
    console.error("Failed to save token:", error);
    return false;
  }
}

let logoutTimer = null;

export function runLogoutTimer(dispatch, timer, navigate) {
  clearLogoutTimer();

  if (timer > 0) {
    logoutTimer = setTimeout(() => {
      console.log("Session expired - logging out");
      dispatch(Logout(navigate));
    }, timer);
  }
}

export function clearLogoutTimer() {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}

export function checkAutoLogin(dispatch, navigate) {
  try {
    const tokenDetailsString = localStorage.getItem(TOKEN_KEY);

    if (!tokenDetailsString) {
      return false;
    }

    const tokenDetails = JSON.parse(tokenDetailsString);

    if (!tokenDetails.token || !tokenDetails.user || !tokenDetails.expireDate) {
      console.warn("Invalid token structure found");
      clearAuthData();
      return false;
    }

    const expireDate = new Date(tokenDetails.expireDate);
    const currentDate = new Date();

    if (currentDate >= expireDate) {
      console.log("Token expired");
      clearAuthData();
      return false;
    }

    const authData = {
      token: tokenDetails.token,
      user: tokenDetails.user,
      success: true,
    };

    dispatch(loginConfirmedAction(authData));

    const remainingTime = expireDate.getTime() - currentDate.getTime();
    runLogoutTimer(dispatch, remainingTime, navigate);

    return true;
  } catch (error) {
    console.error("Error during auto-login check:", error);
    clearAuthData();
    return false;
  }
}

export function isLogin() {
  try {
    const tokenDetailsString = localStorage.getItem(TOKEN_KEY);

    if (!tokenDetailsString) {
      return false;
    }

    const tokenDetails = JSON.parse(tokenDetailsString);

    if (!tokenDetails.token || !tokenDetails.expireDate) {
      return false;
    }

    const expireDate = new Date(tokenDetails.expireDate);
    const currentDate = new Date();

    return currentDate < expireDate;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

export function getStoredUser() {
  try {
    const tokenDetailsString = localStorage.getItem(TOKEN_KEY);

    if (!tokenDetailsString) {
      return null;
    }

    const tokenDetails = JSON.parse(tokenDetailsString);
    return tokenDetails.user || null;
  } catch (error) {
    console.error("Error getting stored user:", error);
    return null;
  }
}

export function clearAuthData() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    clearLogoutTimer();
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
}
