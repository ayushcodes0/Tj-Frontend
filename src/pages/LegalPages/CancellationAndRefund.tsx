import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Styles from './TermsAndConditions.module.css'; 
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

const CancellationAndRefund: React.FC = () => {
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
            <h1 className={Styles.mainHeading}>Refund & Cancellation Policy</h1>
            <p className={Styles.subHeading}>
              Last updated: June 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>No Refund Policy</h2>
                <p className={Styles.sectionText}>
                  All payments made to Trade Diary are final. As our services involve access to digital tools, analytics, 
                  and personal data management, once a subscription is purchased, it cannot be canceled, refunded, 
                  or transferred under any circumstances.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Cancellation Policy</h2>
                <p className={Styles.sectionText}>
                  Trade Diary operates on a subscription-based model. Once your subscription is activated, 
                  you will continue to have access until the end of the current billing cycle.
                </p>
                <p className={Styles.sectionText}>
                  You may choose to cancel your subscription at any time.
                </p>
                <p className={Styles.sectionText}>
                  Cancellation will prevent the next renewal, but no refund will be issued for the remaining period 
                  of an active subscription.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Important Disclaimer</h2>
                <p className={Styles.sectionText}>
                  The Trade Diary platform is intended for journaling, analysis, and performance tracking only. 
                  We do not provide trading advice, stock recommendations, or financial guidance. All insights and reports 
                  are based on user-input data and should be used at your own discretion.
                </p>
                <p className={Styles.sectionText}>
                  Trading and investing involve risk, and we make no guarantee of returns or outcomes based on the use of our platform.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Transparency & Responsibility</h2>
                <p className={Styles.sectionText}>
                  We urge users to fully understand the scope and features of Trade Diary before making any payment. 
                  Please carefully review our Terms of Service, Privacy Policy, and this Refund Policy prior to subscribing.
                </p>
                <p className={Styles.sectionText}>
                  By subscribing to Trade Diary, you acknowledge that you have read, understood, and agreed to the terms stated above.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Us</h2>
                <p className={Styles.sectionText}>
                  For any queries or support regarding refunds or cancellations, please reach out to:
                </p>
                <address className={Styles.contactInfo}>
                  Email: info@tradediary.in<br />
                  Address: 20/A, Balli Buring, Cuncolim Salcete - 403 703, Goa, India
                </address>
                <p className={Styles.sectionText}>
                  We may update this policy from time to time. The updated version will be indicated by an updated "Last updated" date.
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

export default CancellationAndRefund;
