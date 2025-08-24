import { Link } from 'react-router-dom';
import { FilledButton, UnfilledButton } from '../Button/Button';
import Styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiLogOut, FiUpload } from 'react-icons/fi';
import { FaCrown, FaLeaf } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth';
import PlaceholderImage from "../../assets/image/placeholderImage.jpg";

const MOBILE_BREAKPOINT = 883;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  const { user, logout, updateAvatar } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleAvatarSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await updateAvatar(file);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch {
      alert('Failed to update avatar.');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsProfileOpen(false);
    }
  };
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isPro = user?.subscription?.plan === 'pro';

  return (
    <div className={Styles.navbar}>
      <div>
        <Link to={"/"}><p className={Styles.logo}>TradeJournal</p></Link>
      </div>

      <div className={Styles.navLinks}>
        <a href="#home" className={Styles.navLink}>
          Home
        </a>
        <div>
          <Link to="/pricing" className={Styles.navLink}>Pricing</Link>
        </div>
        <div>
          <Link to="/dashboard" className={Styles.navLink}>Dashboard</Link>
        </div>
        <a href="contact" className={Styles.navLink}>
          Contact
        </a>
      </div>
      
      <div className={Styles.buttons}>
        {!user ? (
          <>
            <div>
              <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
            </div>
            <div>
              <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
            </div>
          </>
        ) : (
          <>
            {/* The username is now wrapped in a div with the onClick handler */}
            <div 
              className={Styles.usernameContainer} 
              onClick={() => {
                if (!isMobile) setIsProfileOpen(v => !v);
              }}
            >
              <p className={Styles.username}>
                {user.username}
              </p>
            </div>
            <div 
              className={Styles.avatarLink} 
              onClick={() => {
                if (!isMobile) setIsProfileOpen(v => !v);
              }}
            >
              <img
                src={user.avatar || PlaceholderImage}
                alt={user.username}
                className={Styles.avatarImg}
              />
            </div>
          </>
        )}
      </div>

      <button 
        className={Styles.menuButton} 
        onClick={() => setIsMenuOpen(o => !o)}
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {isMenuOpen && (
        <div className={`${Styles.mobileMenuContainer} ${isMenuOpen ? Styles.mobileMenuOpen : ''}`}>
          <div className={Styles.mobileNavLinks}>
            <a 
              href="#home" 
              className={Styles.navLink} 
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <div>
              <Link to="/pricing" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            </div>
            <div>
              <Link to="/dashboard" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            </div>
            <a 
              href="#contact" 
              className={Styles.navLink} 
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
          </div>
          
          <div className={Styles.mobileButtons}>
            {!user ? (
              <>
                <div>
                  <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
                </div>
                <div>
                  <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
                </div>
              </>
            ) : (
              <div style={{ width: "100%" }}>
                <div className={Styles.mobileProfileSection}>
                  <div className={Styles.mobileAvatarWrap}>
                    <img
                      src={user.avatar || PlaceholderImage}
                      alt={user.username}
                      className={Styles.mobileAvatarImg}
                    />
                  </div>
                  <div className={Styles.mobileUserInfo}>
                    <p className={Styles.mobileUsername}>{user.username}</p>
                    <p className={Styles.mobileUseremail}>{user.email || 'No email provided'}</p>
                  </div>
                  <div className={Styles.dropdownDivider}></div>
                  <div className={Styles.mobileDropdownItem}>
                    {isPro ? (
                      <span className={Styles.proText}>Pro Plan</span>
                    ) : (
                      <span>Free Plan</span>
                    )}
                  </div>
                  <div className={Styles.dropdownDivider}></div>
                  <div
                    className={`${Styles.mobileDropdownItem} ${Styles.dropdownItemHover}`}
                    onClick={handleAvatarSelect}
                  >
                    <FiUpload className={Styles.drawerIcon} />
                    <span>Profile Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className={Styles.dropdownDivider}></div>
                  <button
                    className={Styles.mobileLogout}
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!isMobile && (
        <>
          {isProfileOpen && (
            <>
              <div className={Styles.overlay} onClick={handleOverlayClick} />
              <div 
                className={`${Styles.dropdownContainer} ${isProfileOpen ? Styles.open : ''}`} 
                onClick={handleDrawerClick}
              >
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
                <div className={Styles.dropdownDivider}></div>
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
                <div className={Styles.dropdownDivider}></div>
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
          )}
        </>
      )}
    </div>
  );
};

export default Navbar;