import Styles from './Login.module.css';
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData);
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login clicked');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        
        <form onSubmit={handleSubmit} className={Styles.loginForm}>
          <div className={Styles.formGroup}>
            <div className={Styles.inputContainer}>
              <FaEnvelope className={Styles.inputIcon} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className={Styles.formInput}
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className={Styles.formGroup}>
            <div className={Styles.inputContainer}>
              <FaLock className={Styles.inputIcon} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                className={Styles.formInput}
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className={Styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={Styles.forgotPassword}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>
          
          <button type="submit" className={Styles.loginButton}>
            Login
          </button>
          
          <div className={Styles.divider}>
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            className={Styles.googleButton}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className={Styles.googleIcon} />
            Continue with Google
          </button>
          
          <div className={Styles.signupLink}>
            Don't have an account? <Link to="/register">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;