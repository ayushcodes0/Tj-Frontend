import Styles from './Footer.module.css';
import { FaLinkedin, FaYoutube } from 'react-icons/fa';
import { RiTwitterXFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";



const Footer = () => {
  return (
    <div className={Styles.footerWrapper}>
      <div className={Styles.footer}>
        <div className={Styles.footerLogo}>
          <p className={Styles.logo}>TradeJournal</p>
          <p className={Styles.email}>TradeJournal@gmail.com</p>
          {/* Social media links are a great way to build community and trust */}
          <div className={Styles.socials}>
            <a href="#" aria-label="Twitter"><RiTwitterXFill /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="YouTube"><BsInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="YouTube"><FaWhatsapp /></a>
          </div>
        </div>
        <div className={Styles.footerContent}>
          {/* Column 1: Core Product Features */}
          <div className={Styles.footerItems}>
              <p className={Styles.footerItemsHead}>Product</p>
              <p className={Styles.footerItemsText}>Dashboard</p>
              <p className={Styles.footerItemsText}>AI Insights</p>
              <p className={Styles.footerItemsText}>Psychology Tracking</p>
              <p className={Styles.footerItemsText}>Pricing</p>
          </div>
          {/* Column 2: Company Information */}
          <div className={Styles.footerItems}>
              <p className={Styles.footerItemsHead}>Company</p>
              <p className={Styles.footerItemsText}>About Us</p>
              <p className={Styles.footerItemsText}>Blog</p>
              <p className={Styles.footerItemsText}>Careers</p>
              <p className={Styles.footerItemsText}>Contact</p>
          </div>
          {/* Column 3: Support and Resources */}
          <div className={Styles.footerItems}>
              <p className={Styles.footerItemsHead}>Resources</p>
              <p className={Styles.footerItemsText}>Help Center</p>
              <p className={Styles.footerItemsText}>Getting Started</p>
              <p className={Styles.footerItemsText}>Community</p>
              <p className={Styles.footerItemsText}>Feature Requests</p>
          </div>
          {/* Column 4: Legal Information (Crucial for a financial app) */}
          <div className={Styles.footerItems}>
              <p className={Styles.footerItemsHead}>Legal</p>
              <p className={Styles.footerItemsText}>Terms of Service</p>
              <p className={Styles.footerItemsText}>Privacy Policy</p>
              <p className={Styles.footerItemsText}>Disclaimer</p>
              <p className={Styles.footerItemsText}>Security</p>
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
