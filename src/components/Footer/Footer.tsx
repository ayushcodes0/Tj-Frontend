import Styles from './Footer.module.css';
import { FaLinkedin, FaYoutube } from 'react-icons/fa';
import { RiTwitterXFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoLocation } from "react-icons/io5";


const Footer = () => {
  return (
    <div className={Styles.footerWrapper}>
      <div className={Styles.footer}>
        <div className={Styles.footerLogo}>
          <p className={Styles.logo}><span className={Styles.TJLogo}>TJ</span>Tradejournalai</p>
          <p className={Styles.email}>tradejournal.ai@gmail.com</p>
          <p className={Styles.location}>Location <span className={Styles.locIcon}><IoLocation/></span>: Cocoon Coworks 15th main, 2nd stage BTM layout, Bangalore</p>

          <div className={Styles.socials}>
            <a target='_blank' href="https://x.com/tradejournal_ai?t=ig9DqGrD_kHbF0yWEUecTg&s=09" aria-label="Twitter"><RiTwitterXFill /></a>
            <a target='_blank' href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a target='_blank' href="https://www.instagram.com/tradejournal.ai?igsh=dnQwcDJldTBqczho" aria-label="Instagram"><BsInstagram /></a>
            <a target='_blank' href="#" aria-label="YouTube"><FaYoutube /></a>
            <a target='_blank' href="#" aria-label="Whatsapp"><FaWhatsapp /></a>
          </div>
        </div>
        <div className={Styles.footerContent}>
          <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Product</p>
            <Link to="/login" className={Styles.footerItemsText}>Dashboard</Link>
            <Link to="/login" className={Styles.footerItemsText}>AI Insights</Link>
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
            <Link to="/terms-and-conditions" className={Styles.footerItemsText}>Terms & Conditions</Link>
            <Link to="/cancellation-and-refund" className={Styles.footerItemsText}>Cancellation & Refund</Link>
            <Link to="/shipping" className={Styles.footerItemsText}>Shipping Policy</Link>
            <Link to="/disclosure" className={Styles.footerItemsText}>Disclosure</Link>
            <Link to="/privacy-policy" className={Styles.footerItemsText}>Privacy Policy</Link>
            <Link to="/disclaimer" className={Styles.footerItemsText}>Disclaimer</Link>
          </div>
        </div>
      </div>
      <div className={Styles.footerBottom}>
      <p className={Styles.footerBottomText}>
        © {new Date().getFullYear()} Tradejournalai. All rights reserved. 
        <span style={{ marginLeft: "8px" }}>
          | Developed by {" "}
          <a 
            href="https://ayush.jeearchive.in" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontWeight: 600, textDecoration: "underline", color: 'var(--hero-title)' }}
          >
            Ayush Singh
          </a>
        </span>
      </p>

      <p className={`${Styles.footerBottomText} ${Styles.version}`}>Version 1.0.1</p>
    </div>

    </div>
  )
}

export default Footer;