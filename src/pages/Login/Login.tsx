// Update your existing Login component
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Styles from './Login.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useCustomToast } from '../../hooks/useCustomToast';
import { useGoogleAuth } from '../../hooks/useGoogleAuth'; // Add this import

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { initiateGoogleLogin } = useGoogleAuth(); // Add this hook
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      showSuccessToast('Login successful! Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      showErrorToast(errorMessage);
    }
  };

  // Update this function
  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className={Styles.loginPageContainer}>
      <div className={Styles.blurryBalls}>
        <div className={Styles.ball1}></div>
        <div className={Styles.ball2}></div>
        <div className={Styles.ball3}></div>
        <div className={Styles.ball4}></div>
        <div className={Styles.ball5}></div>
      </div>
      
      <div className={Styles.loginContent}>
        <h1 className={Styles.loginTitle}>Welcome Back</h1>
        
        <form onSubmit={handleSubmit} className={Styles.loginForm} noValidate>
          {/* Email Field */}
          <div className={Styles.formGroup}>
            <div className={`${Styles.inputContainer} ${validationErrors.email ? Styles.inputError : ''}`}>
              <FaEnvelope className={Styles.inputIcon} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className={Styles.formInput}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {validationErrors.email && (
              <span className={Styles.validationError}>{validationErrors.email}</span>
            )}
          </div>
          
          {/* Password Field */}
          <div className={Styles.formGroup}>
            <div className={`${Styles.inputContainer} ${validationErrors.password ? Styles.inputError : ''}`}>
              <FaLock className={Styles.inputIcon} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                className={Styles.formInput}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button 
                type="button" 
                className={Styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.password && (
              <span className={Styles.validationError}>{validationErrors.password}</span>
            )}
            {/* <div className={Styles.forgotPassword}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div> */}
          </div>
          
          <button 
            type="submit" 
            className={Styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className={Styles.divider}>
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            className={Styles.googleButton}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className={Styles.googleIcon} />
            Continue with Google
          </button>
          
          <div className={Styles.signupLink}>
            <span>Don't have an account? <Link to="/register">Create account</Link></span>
            <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className={Styles.goBackButton}
                >
                  Back to Home
                </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
