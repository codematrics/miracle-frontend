import { toast } from 'react-toastify';

import { ErrorType, createError } from '../store/types';

// Error handler utility class
export class ErrorHandler {
  static handleApiError(error, customMessage = null) {
    let errorResponse = {
      type: ErrorType.SERVER,
      message: 'An unexpected error occurred',
      details: null,
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorResponse = createError(
            ErrorType.VALIDATION,
            data?.message || 'Invalid request data',
            data?.errors
          );
          break;
        case 401:
          errorResponse = createError(ErrorType.AUTHENTICATION, 'Please log in to continue', data);
          break;
        case 403:
          errorResponse = createError(
            ErrorType.AUTHORIZATION,
            'You do not have permission to perform this action',
            data
          );
          break;
        case 404:
          errorResponse = createError(
            ErrorType.NOT_FOUND,
            'The requested resource was not found',
            data
          );
          break;
        case 422:
          errorResponse = createError(
            ErrorType.VALIDATION,
            data?.message || 'Validation failed',
            data?.errors
          );
          break;
        case 429:
          errorResponse = createError(
            ErrorType.SERVER,
            'Too many requests. Please try again later',
            data
          );
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorResponse = createError(
            ErrorType.SERVER,
            'Server error. Please try again later',
            data
          );
          break;
        default:
          errorResponse = createError(
            ErrorType.SERVER,
            data?.message || 'Server error occurred',
            data
          );
      }
    } else if (error.request) {
      // Network error
      errorResponse = createError(
        ErrorType.NETWORK,
        'Network error. Please check your connection and try again',
        error.request
      );
    } else {
      // Other error
      errorResponse = createError(
        ErrorType.SERVER,
        error.message || 'An unexpected error occurred',
        error
      );
    }

    // Use custom message if provided
    if (customMessage) {
      errorResponse.message = customMessage;
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorResponse, error);
    }

    return errorResponse;
  }

  static showToast(error, options = {}) {
    const {
      position = 'top-right',
      autoClose = 5000,
      hideProgressBar = false,
      closeOnClick = true,
      pauseOnHover = true,
      draggable = true,
    } = options;

    const toastOptions = {
      position,
      autoClose,
      hideProgressBar,
      closeOnClick,
      pauseOnHover,
      draggable,
    };

    if (typeof error === 'string') {
      toast.error(error, toastOptions);
      return;
    }

    if (error?.type) {
      switch (error.type) {
        case ErrorType.VALIDATION:
          toast.error(error.message, { ...toastOptions, icon: '⚠️' });
          break;
        case ErrorType.AUTHENTICATION:
          toast.warn(error.message, { ...toastOptions, icon: '🔒' });
          break;
        case ErrorType.AUTHORIZATION:
          toast.warn(error.message, { ...toastOptions, icon: '🚫' });
          break;
        case ErrorType.NOT_FOUND:
          toast.info(error.message, { ...toastOptions, icon: '🔍' });
          break;
        case ErrorType.NETWORK:
          toast.error(error.message, { ...toastOptions, icon: '📶' });
          break;
        default:
          toast.error(error.message, toastOptions);
      }
    } else {
      toast.error(error?.message || 'An error occurred', toastOptions);
    }
  }

  static showSuccess(message, options = {}) {
    const {
      position = 'top-right',
      autoClose = 3000,
      hideProgressBar = false,
      closeOnClick = true,
      pauseOnHover = true,
      draggable = true,
    } = options;

    toast.success(message, {
      position,
      autoClose,
      hideProgressBar,
      closeOnClick,
      pauseOnHover,
      draggable,
      icon: '✅',
    });
  }

  static showInfo(message, options = {}) {
    const {
      position = 'top-right',
      autoClose = 4000,
      hideProgressBar = false,
      closeOnClick = true,
      pauseOnHover = true,
      draggable = true,
    } = options;

    toast.info(message, {
      position,
      autoClose,
      hideProgressBar,
      closeOnClick,
      pauseOnHover,
      draggable,
      icon: 'ℹ️',
    });
  }

  static showWarning(message, options = {}) {
    const {
      position = 'top-right',
      autoClose = 4000,
      hideProgressBar = false,
      closeOnClick = true,
      pauseOnHover = true,
      draggable = true,
    } = options;

    toast.warn(message, {
      position,
      autoClose,
      hideProgressBar,
      closeOnClick,
      pauseOnHover,
      draggable,
      icon: '⚠️',
    });
  }

  // Validation error helper
  static getValidationErrors(error) {
    if (error?.details && typeof error.details === 'object') {
      return Object.entries(error.details).reduce((acc, [field, messages]) => {
        acc[field] = Array.isArray(messages) ? messages[0] : messages;
        return acc;
      }, {});
    }
    return {};
  }

  // Format validation errors for forms
  static formatValidationErrors(errors) {
    if (!errors || typeof errors !== 'object') return {};

    return Object.entries(errors).reduce((formatted, [field, message]) => {
      formatted[field] = {
        type: 'server',
        message: Array.isArray(message) ? message[0] : message,
      };
      return formatted;
    }, {});
  }
}

// Convenience functions
export const handleError = ErrorHandler.handleApiError;
export const showErrorToast = ErrorHandler.showToast;
export const showSuccessToast = ErrorHandler.showSuccess;
export const showInfoToast = ErrorHandler.showInfo;
export const showWarningToast = ErrorHandler.showWarning;
export const getValidationErrors = ErrorHandler.getValidationErrors;
export const formatValidationErrors = ErrorHandler.formatValidationErrors;

export default ErrorHandler;
