import Styles from './Login.module.css';

const Login = () => {
  return (
    <div className={Styles.loginPageContainer}>
      {/* Enhanced blurry balls background */}
      <div className={Styles.blurryBalls}>
        <div className={Styles.ball1}></div>
        <div className={Styles.ball2}></div>
        <div className={Styles.ball3}></div>
        <div className={Styles.ball4}></div>
        <div className={Styles.ball5}></div>
      </div>
      
      {/* Login content */}
      <div className={Styles.loginContent}>
        <h1>Welcome Back</h1>
        {/* Your login form would go here */}
      </div>
    </div>
  )
}

export default Login;