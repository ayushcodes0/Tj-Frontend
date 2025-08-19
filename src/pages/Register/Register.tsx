import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Styles from './Register.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useCustomToast } from '../../hooks/useCustomToast';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register(formData.username, formData.email, formData.password);
      showSuccessToast('Registration successful! Welcome aboard!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      showErrorToast(errorMessage);
    }
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
    <div className={Styles.registerPageContainer}>
      <div className={Styles.blurryBalls}>
        <div className={Styles.ball1}></div>
        <div className={Styles.ball2}></div>
        <div className={Styles.ball3}></div>
        <div className={Styles.ball4}></div>
        <div className={Styles.ball5}></div>
      </div>
      
      <div className={Styles.registerContent}>
        <h1 className={Styles.registerTitle}>Create Account</h1>
        
        <form onSubmit={handleSubmit} className={Styles.registerForm} noValidate>
          {/* Username Field */}
          <div className={Styles.formGroup}>
            <div className={`${Styles.inputContainer} ${validationErrors.username ? Styles.inputError : ''}`}>
              <FaUser className={Styles.inputIcon} />
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                className={Styles.formInput}
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {validationErrors.username && (
              <span className={Styles.validationError}>{validationErrors.username}</span>
            )}
          </div>

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
          </div>
          
          <button 
            type="submit" 
            className={Styles.registerButton}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className={Styles.divider}>
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            className={Styles.googleButton}
            disabled={loading}
          >
            <FcGoogle className={Styles.googleIcon} />
            Sign up with Google
          </button>
          
          <div className={Styles.loginLink}>
            <span>Already have an account? <Link to="/login">Sign in</Link></span>
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

export default Register; 