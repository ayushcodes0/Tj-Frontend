// src/hooks/useCustomToast.ts
import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react'; // --- IMPORT useCallback ---

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
  // --- WRAP THE FUNCTION IN useCallback ---
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
  }, []); // --- ADD EMPTY DEPENDENCY ARRAY ---

  // --- WRAP THE FUNCTION IN useCallback ---
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
  }, []); // --- ADD EMPTY DEPENDENCY ARRAY ---

  return { showSuccessToast, showErrorToast };
};
