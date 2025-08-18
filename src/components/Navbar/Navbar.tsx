import { Link } from 'react-router-dom';
import { FilledButton, UnfilledButton } from '../Button/Button';
import Styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiLogOut, FiUpload } from 'react-icons/fi';
import { FaCrown, FaLeaf } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth';
import PlaceholderImage from "../../assets/image/placeholderImage.jpg";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

const MOBILE_BREAKPOINT = 883;

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [hasMounted, setHasMounted] = useState(false);

  const { user, logout, updateAvatar } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    setHasMounted(true);
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
    <motion.div 
      className={Styles.navbar}
      initial="hidden"
      animate={hasMounted ? "visible" : "hidden"}
      variants={fadeIn}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Link to={"/"}><p className={Styles.logo}>TradeJournal</p></Link>
      </motion.div>

      <motion.div 
        className={Styles.navLinks}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        <motion.a 
          href="#home" 
          className={Styles.navLink}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Home
        </motion.a>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link to="/pricing" className={Styles.navLink}>Pricing</Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link to="/dashboard" className={Styles.navLink}>Dashboard</Link>
        </motion.div>
        <motion.a 
          href="#contact" 
          className={Styles.navLink}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Contact
        </motion.a>
      </motion.div>
      
      <motion.div 
        className={Styles.buttons}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {!user ? (
          <>
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
            </motion.div>
          </>
        ) : (
          <>
            <motion.p 
              className={Styles.username}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {user.username}
            </motion.p>
            <motion.div 
              className={Styles.avatarLink} 
              onClick={() => {
                if (!isMobile) setIsProfileOpen(v => !v);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={user.avatar || PlaceholderImage}
                alt={user.username}
                className={Styles.avatarImg}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      <motion.button 
        className={Styles.menuButton} 
        onClick={() => setIsMenuOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </motion.button>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className={`${Styles.mobileMenuContainer} ${isMenuOpen ? Styles.mobileMenuOpen : ''}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className={Styles.mobileNavLinks}>
              <motion.a 
                href="#home" 
                className={Styles.navLink} 
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Home
              </motion.a>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/pricing" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/dashboard" className={Styles.navLink} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              </motion.div>
              <motion.a 
                href="#contact" 
                className={Styles.navLink} 
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact
              </motion.a>
            </div>
            
            <div className={Styles.mobileButtons}>
              {!user ? (
                <>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={"/login"} className={Styles.loginBtn}><UnfilledButton text="Log in" /></Link>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={"/register"} className={Styles.registerBtn}><FilledButton text="Get started" /></Link>
                  </motion.div>
                </>
              ) : (
                <div style={{ width: "100%" }}>
                  <div className={Styles.mobileProfileSection}>
                    <motion.div 
                      className={Styles.mobileAvatarWrap}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={user.avatar || PlaceholderImage}
                        alt={user.username}
                        className={Styles.mobileAvatarImg}
                      />
                    </motion.div>
                    <div className={Styles.mobileUserInfo}>
                      <p className={Styles.mobileUsername}>{user.username}</p>
                      <p className={Styles.mobileUseremail}>{user.email || 'No email provided'}</p>
                    </div>
                    <div className={Styles.dropdownDivider}></div>
                    <motion.div 
                      className={Styles.mobileDropdownItem}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isPro ? (
                        <span className={Styles.proText}>Pro Plan</span>
                      ) : (
                        <span>Free Plan</span>
                      )}
                    </motion.div>
                    <div className={Styles.dropdownDivider}></div>
                    <motion.div
                      className={`${Styles.mobileDropdownItem} ${Styles.dropdownItemHover}`}
                      onClick={handleAvatarSelect}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.div>
                    <div className={Styles.dropdownDivider}></div>
                    <motion.button
                      className={Styles.mobileLogout}
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Log Out</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isMobile && (
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <motion.div 
                className={Styles.overlay} 
                onClick={handleOverlayClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div 
                className={`${Styles.dropdownContainer} ${isProfileOpen ? Styles.open : ''}`} 
                onClick={handleDrawerClick}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
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
                <motion.div 
                  className={Styles.dropdownItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
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
                </motion.div>
                <div className={Styles.dropdownDivider}></div>
                <motion.div
                  className={`${Styles.dropdownItem} ${Styles.dropdownItemHover}`}
                  onClick={handleAvatarSelect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.div>
                <div className={Styles.dropdownDivider}></div>
                <motion.button
                  className={Styles.dropdownLogout}
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiLogOut className={Styles.dropdownIcon} />
                  <span>Log Out</span>
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default Navbar;
