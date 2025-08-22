import Styles from './Footer.module.css';
import { FaLinkedin, FaYoutube } from 'react-icons/fa';
import { RiTwitterXFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className={Styles.footerWrapper}>
      <div className={Styles.footer}>
        <div className={Styles.footerLogo}>
          <p className={Styles.logo}>TradeJournal</p>
          <p className={Styles.email}>TradeJournal@gmail.com</p>
          <div className={Styles.socials}>
            <a href="#" aria-label="Twitter"><RiTwitterXFill /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Instagram"><BsInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Whatsapp"><FaWhatsapp /></a>
          </div>
        </div>
        <div className={Styles.footerContent}>
          <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Product</p>
            <Link to="/login" className={Styles.footerItemsText}>Dashboard</Link>
            <Link to="/login" className={Styles.footerItemsText}>AI Insights</Link>
            <Link to="/login" className={Styles.footerItemsText}>Psychology Tracking</Link>
            <Link to="/login" className={Styles.footerItemsText}>Pricing</Link>
          </div>
          <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Company</p>
            <Link to="/about-us" className={Styles.footerItemsText}>About Us</Link>
            <Link to="/contact" className={Styles.footerItemsText}>Contact</Link>
          </div>
          <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Resources</p>
            <Link to={"/getting-started"} className={Styles.footerItemsText}>Getting Started</Link>
          </div>
          <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Legal</p>
            <Link to="/terms-of-service" className={Styles.footerItemsText}>Terms of Service</Link>
            <Link to="/privacy-policy" className={Styles.footerItemsText}>Privacy Policy</Link>
            <Link to="/disclaimer" className={Styles.footerItemsText}>Disclaimer</Link>
            <Link to="/security" className={Styles.footerItemsText}>Security</Link>
          </div>
        </div>
      </div>
      <div className={Styles.footerBottom}>
        <p className={Styles.footerBottomText}>© {new Date().getFullYear()} TradeJournal. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer;