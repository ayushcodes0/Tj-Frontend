// src/hooks/useCustomToast.ts
import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react';
import { toastMessages } from '../utils/toastMessages'; // Import your messages

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const useCustomToast = () => {
  const showSuccessToast = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      type: 'success',
      style: {
        background: '#ffffff',
        color: '#4840BB',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
      className: 'custom-success-toast',
    });
  }, []);

  const showErrorToast = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      type: 'error',
      style: {
        background: '#ffffff',
        color: '#ff4444',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      },
      className: 'custom-error-toast',
    });
  }, []);

  // NEW: Info toast for general messages
  const showInfoToast = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      type: 'info',
      style: {
        background: '#ffffff',
        color: '#2563eb',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
      className: 'custom-info-toast',
    });
  }, []);

  // NEW: Warning toast
  const showWarningToast = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      type: 'warning',
      style: {
        background: '#ffffff',
        color: '#f59e0b',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
      className: 'custom-warning-toast',
    });
  }, []);

  // NEW: Smart API error handler
  const handleApiError = useCallback((error: unknown) => {
  // Log the technical error for debugging
  console.error('API Error:', error);
  
  // Type guard for objects with response property (fetch API style)
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as {
      response?: {
        status?: number;
        data?: { message?: string };
      };
      code?: string;
      message?: string;
    };
    
    if (err.response?.status === 401) {
      showErrorToast(toastMessages.auth.unauthorized);
    } else if (err.response?.status === 403) {
      showErrorToast("You don't have permission to perform this action.");
    } else if (err.response?.status === 404) {
      showErrorToast("The requested resource was not found.");
    } else if (err.response?.status === 413) {
      showErrorToast(toastMessages.files.uploadLimit);
    } else if (err.response?.data?.message) {
      showErrorToast(err.response.data.message);
    } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('timeout')) {
      showErrorToast(toastMessages.network.timeout);
    } else if (err.code === 'ERR_INTERNET_DISCONNECTED') {
      showErrorToast(toastMessages.network.offline);
    } else {
      showErrorToast("Something went wrong. Please try again.");
    }
  } else if (error instanceof Error) {
    // Handle standard Error objects
    if (error.message?.includes('timeout')) {
      showErrorToast(toastMessages.network.timeout);
    } else if (error.message?.includes('fetch')) {
      showErrorToast(toastMessages.network.serverError);
    } else {
      showErrorToast("Something went wrong. Please try again.");
    }
  } else {
    // Generic fallback for any other type
    showErrorToast("Something went wrong. Please try again.");
  }
}, [showErrorToast]);


  // NEW: Validation error handler
  const handleValidationError = useCallback((field: string, errorType?: string) => {
    switch (errorType) {
      case 'required':
        showErrorToast(toastMessages.validation.required(field));
        break;
      case 'email':
        showErrorToast(toastMessages.validation.email);
        break;
      case 'password':
        showErrorToast(toastMessages.validation.password);
        break;
      default:
        showErrorToast(toastMessages.validation.generic);
    }
  }, [showErrorToast]);

  // NEW: Pre-configured methods for common trading journal actions
  const tradingToasts = useCallback(() => ({
    tradeAdded: () => showSuccessToast(toastMessages.trading.tradeAdded),
    tradeUpdated: () => showSuccessToast(toastMessages.trading.tradeUpdated),
    tradeDeleted: () => showSuccessToast(toastMessages.trading.tradeDeleted),
    tradeError: () => showErrorToast(toastMessages.trading.tradeError),
    invalidAmount: () => showErrorToast(toastMessages.trading.invalidAmount),
    invalidDate: () => showErrorToast(toastMessages.trading.invalidDate),
  }), [showSuccessToast, showErrorToast]);

  // NEW: Auth-related toasts
  const authToasts = useCallback(() => ({
    loginSuccess: () => showSuccessToast(toastMessages.auth.loginSuccess),
    loginError: () => showErrorToast(toastMessages.auth.loginError),
    logoutSuccess: () => showSuccessToast(toastMessages.auth.logoutSuccess),
    signupSuccess: () => showSuccessToast(toastMessages.auth.signupSuccess),
    signupError: () => showErrorToast(toastMessages.auth.signupError),
    passwordReset: () => showInfoToast(toastMessages.auth.passwordReset),
    tokenExpired: () => showWarningToast(toastMessages.auth.tokenExpired),
  }), [showSuccessToast, showErrorToast, showInfoToast, showWarningToast]);

  // NEW: File operation toasts
  const fileToasts = useCallback(() => ({
    uploadSuccess: () => showSuccessToast(toastMessages.files.uploadSuccess),
    uploadError: () => showErrorToast(toastMessages.files.uploadError),
    uploadLimit: () => showErrorToast(toastMessages.files.uploadLimit),
    invalidFormat: () => showErrorToast(toastMessages.files.invalidFormat),
    deleteSuccess: () => showSuccessToast(toastMessages.files.deleteSuccess),
    deleteError: () => showErrorToast(toastMessages.files.deleteError),
  }), [showSuccessToast, showErrorToast]);

  return { 
    // Original methods
    showSuccessToast, 
    showErrorToast,
    
    // New methods
    showInfoToast,
    showWarningToast,
    handleApiError,
    handleValidationError,
    
    // Pre-configured toast groups
    trading: tradingToasts(),
    auth: authToasts(),
    files: fileToasts(),
    
    // Direct access to messages for custom usage
    messages: toastMessages,
  };
};
