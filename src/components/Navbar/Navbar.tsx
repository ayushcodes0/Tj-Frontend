import { Link } from 'react-router-dom';
import { FilledButton, UnfilledButton } from '../Button/Button'
import Styles from './Navbar.module.css'
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import PlaceholderImage from "../../assets/image/placeholderImage.jpg"


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  console.log("Nav user : ", user);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div className={Styles.navbar}>
      <Link to={"/"}><p className={Styles.logo}>LoremIpsum</p></Link>
      
      <div className={Styles.navLinks}>
        <a href="#home" className={Styles.navLink}>Home</a>
        <Link to="/pricing" className={Styles.navLink}>Pricing</Link>
        <a href="#services" className={Styles.navLink}>Services</a>
        <a href="#contact" className={Styles.navLink}>Contact</a>
      </div>
      
      <div className={Styles.buttons}>
        {!user ? (
          <>
            <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
            <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
          </>
        ) : (
          <>
            <p className={Styles.username}>{user.username}</p>
            <Link to="/dashboard/profile" className={Styles.avatarLink}>
            <img
              src={user.avatar || PlaceholderImage}
              alt={user.username}
              className={Styles.avatarImg}
            />
          </Link>
          </>
        )}
      </div>


      <button className={Styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      <div className={`${Styles.mobileMenuContainer} ${isMenuOpen ? Styles.mobileMenuOpen : ''}`}>
        <div className={Styles.mobileNavLinks}>
          <a href="#home" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</a>
          <Link to="/pricing" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <a href="#services" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#contact" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
        
        {/* Mobile Buttons at the bottom */}
        <div className={Styles.mobileButtons}>
          {!user ? (
            <>
              <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
              <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
            </>
          ) : (
            <Link to="/dashboard/profile" className={Styles.avatarLink} onClick={() => setIsMenuOpen(false)}>
              <img
                src={user.avatar || PlaceholderImage}
                alt={user.username}
                className={Styles.avatarImg}
              />
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

export default Navbar;