import { Link } from 'react-router-dom';
import { FilledButton, UnfilledButton } from '../Button/Button';
import Styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { FaCrown, FaLeaf } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import PlaceholderImage from "../../assets/image/placeholderImage.jpg";

// interface User {
//   username: string;
//   email?: string;
//   avatar?: string;
//   subscription?: {
//     plan: string;
//   };
// }


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, updateAvatar } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await updateAvatar(file);
      setIsProfileOpen(false);
      // Optionally show a toast: "Profile image updated!"
    } catch {
      // Show error message/toast if needed
      alert('Failed to update avatar.');
    }
  };
  
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

  // Close drawer when clicking on overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsProfileOpen(false);
    }
  };

  // Prevent clicks inside drawer from closing it
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isPro = user?.subscription?.plan === 'pro';

  return (
    <div className={Styles.navbar}>
      <Link to={"/"}><p className={Styles.logo}>LoremIpsum</p></Link>
      
      <div className={Styles.navLinks}>
        <a href="#home" className={Styles.navLink}>Home</a>
        <Link to="/pricing" className={Styles.navLink}>Pricing</Link>
        <Link to="/dashboard" className={Styles.navLink}>Dashboard</Link>
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
          <Link to="/pricing" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <Link to="/dashboard" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
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
      <>
        {/* Overlay */}
        {isProfileOpen && <div className={Styles.overlay} onClick={handleOverlayClick} />}
        
        {/* Dropdown Container */}
        <div className={`${Styles.dropdownContainer} ${isProfileOpen ? Styles.open : ''}`} onClick={handleDrawerClick}>
          {/* User Info Header */}
          <div className={Styles.dropdownHeader}>
            <div className={Styles.imgContainer}>
              <img 
              src={user?.avatar || PlaceholderImage} 
              alt={user?.username || 'User'} 
              className={Styles.dropdownAvatar}
            />
            </div>
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

          <div
            className={`${Styles.dropdownItem} ${Styles.dropdownItemHover}`}
            onClick={handleAvatarSelect}
          >
            <FiUpload className={Styles.dropdownIcon} />
            <span>Profile Image</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          {/* Divider */}
          <div className={Styles.dropdownDivider}></div>

          {/* Logout Button */}
          <button 
            className={Styles.dropdownLogout} 
            onClick={() => {
              logout();
              setIsProfileOpen(false);
            }}
          >
            <FiLogOut className={Styles.dropdownIcon} />
            <span>Log Out</span>
          </button>
        </div>
      </>
    </div>
  );
};

export default Navbar;