import { Link } from 'react-router-dom';
import { FilledButton, UnfilledButton } from '../Button/Button';
import Styles from '../Navbar/Navbar.module.css';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { FaCrown, FaLeaf } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth';
import PlaceholderImage from "../../assets/image/placeholderImage.jpg";

interface User {
  username: string;
  email?: string;
  avatar?: string;
  subscription?: {
    plan: string;
  };
}

interface UserDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
}

const UserDrawer = ({ user, isOpen, onClose, logout }: UserDrawerProps) => {
  const isPro = user?.subscription?.plan === 'pro';
  
  // Close drawer when clicking on overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent clicks inside drawer from closing it
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={Styles.overlay} onClick={handleOverlayClick} />}
      
      {/* Dropdown Container */}
      <div className={`${Styles.dropdownContainer} ${isOpen ? Styles.open : ''}`} onClick={handleDrawerClick}>
        {/* User Info Header */}
        <div className={Styles.dropdownHeader}>
          <img 
            src={user?.avatar || PlaceholderImage} 
            alt={user?.username || 'User'} 
            className={Styles.dropdownAvatar}
          />
          <div className={Styles.dropdownUserInfo}>
            <h3 className={Styles.dropdownName}>{user?.username || 'User'}</h3>
            <p className={Styles.dropdownEmail}>{user?.email || 'No email provided'}</p>
          </div>
        </div>

        {/* Divider */}
        <div className={Styles.dropdownDivider}></div>

        {/* Subscription Info */}
        <div className={Styles.dropdownItem}>
          {isPro ? (
            <>
              <FaCrown className={`${Styles.dropdownIcon} ${Styles.proIcon}`} />
              <span className={Styles.proText}>Pro Plan</span>
            </>
          ) : (
            <>
              <FaLeaf className={`${Styles.dropdownIcon} ${Styles.freeIcon}`} />
              <span>Free Plan</span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className={Styles.dropdownDivider}></div>

        {/* Logout Button */}
        <button 
          className={Styles.dropdownLogout} 
          onClick={() => {
            logout();
            onClose();
          }}
        >
          <FiLogOut className={Styles.dropdownIcon} />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );
};

const PricingNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Prevent scrolling when mobile menu or profile is open
  useEffect(() => {
    if (isMenuOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isProfileOpen]);

  return (
    <div className={Styles.navbar}>
      <Link to={"/"}><p className={Styles.logo}>LoremIpsum</p></Link>
      
      <div className={Styles.navLinks}>
        <a href="#pricing" className={Styles.navLink}>Pricing</a>
        <a href="#faqs" className={Styles.navLink}>Faqs</a>
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
            <div className={Styles.avatarLink} onClick={toggleProfile}>
              <img
                src={user.avatar || PlaceholderImage}
                alt={user.username}
                className={Styles.avatarImg}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button className={Styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* Mobile menu */}
      <div className={`${Styles.mobileMenuContainer} ${isMenuOpen ? Styles.mobileMenuOpen : ''}`}>
        <div className={Styles.mobileNavLinks}>
          <a href="#home" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#about" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#contact" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
        
        <div className={Styles.mobileButtons}>
          {!user ? (
            <>
              <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
              <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
            </>
          ) : (
            <div className={Styles.avatarLink} onClick={() => {
              toggleProfile();
              setIsMenuOpen(false);
            }}>
              <img
                src={user.avatar || PlaceholderImage}
                alt={user.username}
                className={Styles.avatarImg}
              />
            </div>
          )}
        </div>
      </div>

      {/* User Drawer */}
      <UserDrawer 
        user={user}
        isOpen={isProfileOpen}
        onClose={toggleProfile}
        logout={logout}
      />
    </div>
  );
};

export default PricingNav;
export {UserDrawer}