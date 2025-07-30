import Styles from './Register.module.css';
import { FcGoogle } from 'react-icons/fc';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration submitted:', formData);
  };

  const handleGoogleSignup = () => {
    // Handle Google signup logic here
    console.log('Google signup clicked');
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
        
        <form onSubmit={handleSubmit} className={Styles.registerForm}>
          <div className={Styles.formGroup}>
            <div className={Styles.inputContainer}>
              <FaUser className={Styles.inputIcon} />
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                className={Styles.formInput}
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

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
          </div>
          
          <button type="submit" className={Styles.registerButton}>
            Create Account
          </button>
          
          <div className={Styles.divider}>
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            className={Styles.googleButton}
            onClick={handleGoogleSignup}
          >
            <FcGoogle className={Styles.googleIcon} />
            Sign up with Google
          </button>
          
          <div className={Styles.loginLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;