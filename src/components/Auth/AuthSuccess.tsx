// src/components/Auth/AuthSuccess.tsx
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCustomToast } from '../../hooks/useCustomToast';
import Styles from './AuthSuccess.module.css';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthToken } = useAuth();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const hasProcessed = useRef(false); // Prevent multiple executions

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const redirectPath = searchParams.get('redirect');

    if (error) {
      let errorMessage = 'Authentication failed';
      if (error === 'auth_failed') {
        errorMessage = 'Google authentication failed. Please try again.';
      } else if (error === 'server_error') {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      showErrorToast(errorMessage);
      navigate('/login');
      return;
    }

    if (token) {
      try {
        setAuthToken(token);
        
        setTimeout(() => {
          if (redirectPath === '/dashboard') {
            showSuccessToast('🎉 Welcome! Enjoy your Pro access!');
          } else if (redirectPath === '/pricing') {
            showSuccessToast('Welcome back! Your free trial has expired.');
          } else {
            showSuccessToast('Login successful!');
          }
          
          navigate(redirectPath || '/dashboard');
        }, 1000);
        
      } catch (error) {
        showErrorToast('Failed to process authentication. Please try again.');
        navigate('/login');
        console.log(error)
      }
    } else {
      showErrorToast('No authentication token received. Please try again.');
      navigate('/login');
    }
  }, []); // Remove dependencies to prevent re-runs

  return (
    <div className={Styles.authSuccessContainer}>
      <div className={Styles.spinner}></div>
      <p>Processing authentication...</p>
    </div>
  );
};

export default AuthSuccess;
