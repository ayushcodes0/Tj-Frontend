// src/hooks/useGoogleAuth.ts
import { useCallback } from 'react';
import { useCustomToast } from './useCustomToast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useGoogleAuth = () => {
  const { showErrorToast } = useCustomToast();

  const initiateGoogleLogin = useCallback(() => {
    try {
      // Remove /api from here since it's already in VITE_API_URL
      window.location.href = `${API_BASE_URL}/users/auth/google`;
    } catch (error) {
      showErrorToast('Failed to initiate Google login. Please try again.');
      console.log(error)
    }
  }, [showErrorToast]);

  const initiateGoogleSignup = useCallback(() => {
    try {
      // Same endpoint for both login and signup
      window.location.href = `${API_BASE_URL}/users/auth/google`;
    } catch (error) {
      console.log(error)
      showErrorToast('Failed to initiate Google signup. Please try again.');
    }
  }, [showErrorToast]);

  return {
    initiateGoogleLogin,
    initiateGoogleSignup
  };
};
