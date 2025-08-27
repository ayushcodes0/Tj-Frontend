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

const Disclaimer: React.FC = () => {
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
            <h1 className={Styles.mainHeading}>Privacy Policy & Disclaimer</h1>
            <p className={Styles.subHeading}>
              Last updated: June 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Informational and Educational Purpose Only</h2>
                <p className={Styles.sectionText}>
                  The information provided within this Stock Trading Journal platform is intended solely for 
                  educational and record-keeping purposes. We do not offer financial, investment, or trading advice.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>No Investment Advice</h2>
                <p className={Styles.sectionText}>
                  This platform does not provide buy/sell recommendations or personalized investment strategies. 
                  All trades, analyses, and decisions recorded by users are their own and are not influenced 
                  or endorsed by our team.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Market Risks</h2>
                <p className={Styles.sectionText}>
                  Trading in stocks, options, futures, and other financial instruments carries a high level of risk 
                  and may not be suitable for all investors. You could lose more than your initial investment. 
                  Past performance, whether actual or indicated by historical data, is not indicative of future results.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>No Liability</h2>
                <p className={Styles.sectionText}>
                  We make no guarantees of profitability, performance improvement, or any particular outcome 
                  as a result of using this platform. The journal is a tool to support reflection, discipline, 
                  and transparency in trading behavior.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Third-Party Content</h2>
                <p className={Styles.sectionText}>
                  If you choose to connect your brokerage or use third-party data APIs, you do so at your own discretion. 
                  We do not store your brokerage credentials unless explicitly authorized and encrypted. 
                  We are not liable for any issues arising from third-party platforms.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Policy Updates</h2>
                <p className={Styles.sectionText}>
                  We reserve the right to update or modify this disclaimer at any time without prior notice. 
                  Continued use of this platform constitutes acceptance of any such changes.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Us</h2>
                <p className={Styles.sectionText}>
                  If you have any questions about this Privacy Policy or Disclaimer, please contact us:
                </p>
                <address className={Styles.contactInfo}>
                  Email: info@tradediary.in<br />
                  Address: 20/A, Balli Buring, Cuncolim Salcete - 403 703, Goa, India
                </address>
                <p className={Styles.sectionText}>
                  We may update this Privacy Policy from time to time. The updated version will be indicated 
                  by an updated "Last updated" date.
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

export default Disclaimer;
