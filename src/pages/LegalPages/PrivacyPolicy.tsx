import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Styles from './TermsAndConditions.module.css';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: [0.16, 0.77, 0.47, 0.97],
      duration: 0.6
    }
  }
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={Styles.termsPageContainer}>
      <div className={Styles.navbarContainer}><Navbar /></div>
      <main className={Styles.contentWrapper}>
        <motion.section 
          className={Styles.termsSection}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className={Styles.headingContainer} variants={fadeUpItem}>
            <h1 className={Styles.mainHeading}>Privacy Policy</h1>
            <p className={Styles.subHeading}>
              Last updated: June 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Introduction</h2>
                <p className={Styles.sectionText}>
                  At Trade Diary, your privacy is important to us. This Privacy Policy outlines how we collect, use, 
                  and protect your personal information when you use our trading journal platform and related services.
                </p>
                <p className={Styles.sectionText}>
                  By using Trade Diary, you consent to the practices described in this policy. 
                  Please read it carefully to understand your rights.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Information We Collect</h2>
                <p className={Styles.sectionText}>
                  We collect various types of information to help you get the most out of Trade Diary 
                  and to continuously improve our services.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Account Data:</strong> Name, email, password, and other details provided during registration.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Trade Entries:</strong> Information about your trades including stock symbols, price, quantity, and notes.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Usage Data:</strong> How you interact with our platform and features.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Technical Data:</strong> IP address, browser type, operating system, and device information.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Cookies:</strong> We use cookies to maintain sessions and enhance user experience.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>How We Use Your Data</h2>
                <p className={Styles.sectionText}>The data we collect is used to:</p>
                <p className={Styles.sectionText}>
                  • Provide and maintain your trading journal account<br />
                  • Analyze and improve platform features<br />
                  • Generate performance analytics and insights<br />
                  • Enhance your overall user experience<br />
                  • Communicate important updates or support messages<br />
                  • Ensure platform security and fraud prevention
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Sharing & Disclosure</h2>
                <p className={Styles.sectionText}>
                  We do not sell your data. However, we may share your information in the following circumstances:
                </p>
                <p className={Styles.sectionText}>
                  <strong>Service Providers:</strong> Trusted vendors who help operate and support our platform.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Business Transfers:</strong> In case of a merger, acquisition, or asset sale.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Legal Obligations:</strong> To comply with applicable laws or government requests.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Platform Protection:</strong> To detect, prevent, or address fraud, security, or technical issues.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Your Rights</h2>
                <p className={Styles.sectionText}>Depending on your location, you may have the right to:</p>
                <p className={Styles.sectionText}>
                  • Access the data we hold about you<br />
                  • Update or correct inaccuracies in your data<br />
                  • Request deletion of your account and associated data<br />
                  • Restrict or object to certain data processing activities<br />
                  • Download your data in a portable format
                </p>
                <p className={Styles.sectionText}>
                  To exercise these rights, please contact us through the details below.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Us</h2>
                <p className={Styles.sectionText}>
                  If you have any questions or concerns about our Privacy Policy or data practices, feel free to reach out:
                </p>
                <address className={Styles.contactInfo}>
                  Email: info@tradediary.in<br />
                  Address: 20/A, Balli Buring, Cuncolim Salcete - 403 703, Goa, India
                </address>
                <p className={Styles.sectionText}>
                  We may update this policy periodically. The latest version will always be available on our website.
                </p>
              </section>
            </div>
          </motion.div>
        </motion.section>
      </main>
      <div className={Styles.footerContainer}><Footer /></div>
    </div>
  );
};

export default PrivacyPolicy;
