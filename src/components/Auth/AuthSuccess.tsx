// src/components/Auth/AuthSuccess.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCustomToast } from '../../hooks/useCustomToast';
import Styles from './AuthSuccess.module.css';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthToken } = useAuth(); // Changed from setToken to setAuthToken
  const { showSuccessToast, showErrorToast } = useCustomToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

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
        // Use setAuthToken instead of setToken
        setAuthToken(token);
        showSuccessToast('Login successful! Welcome back!');
        navigate('/dashboard');
      } catch (error) {
        showErrorToast('Failed to process authentication. Please try again.');
        navigate('/login');
        console.log(error)
      }
    } else {
      showErrorToast('No authentication token received. Please try again.');
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthToken, showSuccessToast, showErrorToast]);

  return (
    <div className={Styles.authSuccessContainer}>
      <div className={Styles.spinner}></div>
      <p>Processing authentication...</p>
    </div>
  );
};

export default AuthSuccess;
