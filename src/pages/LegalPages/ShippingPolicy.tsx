import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Styles from './TermsAndConditions.module.css'; // Reusing the same CSS
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Define animation variants (same as Terms & Conditions)
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

const ShippingPolicy: React.FC = () => {
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
            <h1 className={Styles.mainHeading}>Shipping Policy</h1>
            <p className={Styles.subHeading}>
              Effective Date: June 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Digital Service Only</h2>
                <p className={Styles.sectionText}>
                  Trade Diary is a digital platform that provides trading journal services online. No physical goods are shipped. 
                  All our services are accessible through our web and mobile applications.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Instant Access</h2>
                <p className={Styles.sectionText}>
                  Upon successful payment, users will receive immediate access to the selected subscription plan or premium features. 
                  There is no waiting period for service activation.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Email Confirmation</h2>
                <p className={Styles.sectionText}>
                  Subscription and account details will be sent to your registered email address. 
                  If you do not see the email, please check your spam or junk folder before contacting support.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Support</h2>
                <p className={Styles.sectionText}>
                  If you do not gain access within 1 hour of completing your payment, please reach out to us at:
                </p>
                <address className={Styles.contactInfo}>
                  support@tradediary.in
                </address>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>No Shipping Policy</h2>
                <p className={Styles.sectionText}>
                  As all our services are delivered digitally through our web or app platform, no shipping, delivery tracking, 
                  or physical dispatch is required. There are no shipping fees applicable to any of our services.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Need Help?</h2>
                <p className={Styles.sectionText}>
                  For any questions regarding your digital service access or account setup:
                </p>
                <address className={Styles.contactInfo}>
                  Email: info@tradediary.in<br />
                  Address: 20/A, Balli Buring, Cuncolim Salcete - 403 703, Goa, India
                </address>
                <p className={Styles.sectionText}>
                  We may update this policy from time to time. The updated version will be indicated by an updated "Effective Date".
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

export default ShippingPolicy;
