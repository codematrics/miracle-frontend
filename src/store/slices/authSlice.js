import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  clearAuthData,
  formatError,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  showErrorMessage,
  signUp,
} from '../../services/AuthService';

// Async thunks for auth operations
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ username, email, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await signUp(username, email, password);

      if (response.data?.success) {
        const tokenSaved = saveTokenInLocalStorage(response.data);

        if (tokenSaved) {
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate);
          navigate('/dashboard');
          return response.data;
        } else {
          throw new Error('Failed to save authentication data');
        }
      } else {
        const errorMessage = formatError(response.data || { message: 'Signup failed' });
        showErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = formatError(
        error.response?.data || {
          message: error.message || 'Network error occurred',
        }
      );
      showErrorMessage(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await login(email, password);

      if (response.data?.success) {
        const tokenSaved = saveTokenInLocalStorage(response.data);

        if (tokenSaved) {
          runLogoutTimer(dispatch, 7 * 24 * 60 * 60 * 1000, navigate);
          navigate('/dashboard');
          return response.data;
        } else {
          throw new Error('Failed to save authentication data');
        }
      } else {
        const errorMessage = formatError(response.data || { message: 'Login failed' });
        showErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = formatError(
        error.response?.data || {
          message: error.message || 'Network error occurred',
        }
      );
      showErrorMessage(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (navigate, { rejectWithValue }) => {
  try {
    clearAuthData();
    if (navigate) {
      navigate('/login');
    }
    return null;
  } catch (error) {
    console.error('Error during logout:', error);
    if (navigate) {
      navigate('/login');
    }
    return rejectWithValue(error.message);
  }
});

// Initial state
const initialState = {
  user: null,
  token: '',
  email: '',
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: '',
  // Legacy fields for backward compatibility
  auth: {
    email: '',
    idToken: '',
    token: '',
    localId: '',
    expiresIn: '',
    refreshToken: '',
    user: null,
  },
  errorMessage: '',
  showLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
      state.errorMessage = '';
    },
    clearSuccess: state => {
      state.successMessage = '';
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.showLoading = action.payload;
    },
    logout: state => {
      Object.assign(state, {
        ...initialState,
        loading: false,
      });
    },
    // Legacy action for backward compatibility
    loadingToggle: (state, action) => {
      state.loading = action.payload;
      state.showLoading = action.payload;
    },
    // Legacy login confirmed action for backward compatibility
    loginConfirmed: (state, action) => {
      state.loading = false;
      state.showLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.email = action.payload.user?.email || '';
      state.successMessage = 'Login Successfully Completed';
      state.error = null;
      state.errorMessage = '';
      // Legacy state for backward compatibility
      state.auth = {
        ...state.auth,
        token: action.payload.token,
        user: action.payload.user,
        email: action.payload.user?.email || '',
      };
    },
    // Legacy signup confirmed action for backward compatibility
    signupConfirmed: (state, action) => {
      state.loading = false;
      state.showLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.email = action.payload.user?.email || '';
      state.successMessage = 'Signup Successfully Completed';
      state.error = null;
      state.errorMessage = '';
      // Legacy state for backward compatibility
      state.auth = {
        ...state.auth,
        token: action.payload.token,
        user: action.payload.user,
        email: action.payload.user?.email || '',
      };
    },
    // Legacy failed actions for backward compatibility
    loginFailed: (state, action) => {
      state.loading = false;
      state.showLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.errorMessage = action.payload;
      state.successMessage = '';
    },
    signupFailed: (state, action) => {
      state.loading = false;
      state.showLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.errorMessage = action.payload;
      state.successMessage = '';
    },
  },
  extraReducers: builder => {
    builder
      // Signup cases
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.showLoading = true;
        state.error = null;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.showLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.email = action.payload.user?.email || '';
        state.successMessage = 'Signup Successfully Completed';
        // Legacy state for backward compatibility
        state.auth = {
          ...state.auth,
          token: action.payload.token,
          user: action.payload.user,
          email: action.payload.user?.email || '',
        };
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.showLoading = false;
        state.error = action.payload;
        state.errorMessage = action.payload;
        state.successMessage = '';
      })
      // Login cases
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.showLoading = true;
        state.error = null;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.showLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.email = action.payload.user?.email || '';
        state.successMessage = 'Login Successfully Completed';
        // Legacy state for backward compatibility
        state.auth = {
          ...state.auth,
          token: action.payload.token,
          user: action.payload.user,
          email: action.payload.user?.email || '',
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.showLoading = false;
        state.error = action.payload;
        state.errorMessage = action.payload;
        state.successMessage = '';
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, state => {
        Object.assign(state, {
          ...initialState,
          loading: false,
        });
      });
  },
});

// Export actions
export const { 
  clearError, 
  clearSuccess, 
  setLoading, 
  logout, 
  loadingToggle,
  loginConfirmed,
  signupConfirmed,
  loginFailed,
  signupFailed 
} = authSlice.actions;

// Selectors
export const selectAuth = state => state.auth;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthUser = state => state.auth.user;
export const selectAuthToken = state => state.auth.token;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;

// Legacy selectors for backward compatibility
export const selectAuthState = state => state.auth.auth;
export const selectShowLoading = state => state.auth.showLoading;
export const selectErrorMessage = state => state.auth.errorMessage;
export const selectSuccessMessage = state => state.auth.successMessage;

export default authSlice.reducer;
