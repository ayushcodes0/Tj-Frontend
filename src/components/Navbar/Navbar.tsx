import { Link } from 'react-router-dom';
import { FilledButton, UnfilledButton } from '../Button/Button'
import Styles from './Navbar.module.css'
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <p className={Styles.logo}>LoremIpsum</p>
      
      <div className={Styles.navLinks}>
        <a href="#home" className={Styles.navLink}>Home</a>
        <a href="#about" className={Styles.navLink}>About</a>
        <a href="#services" className={Styles.navLink}>Services</a>
        <a href="#contact" className={Styles.navLink}>Contact</a>
      </div>
      
      <div className={Styles.buttons}>
        <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
        <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
      </div>

      <button className={Styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      <div className={`${Styles.mobileMenuContainer} ${isMenuOpen ? Styles.mobileMenuOpen : ''}`}>
        <div className={Styles.mobileNavLinks}>
          <a href="#home" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#about" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#contact" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
        
        {/* Mobile Buttons at the bottom */}
        <div className={Styles.mobileButtons}>
          <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
          <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar;