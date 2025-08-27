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

const Disclosures: React.FC = () => {
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
            <h1 className={Styles.mainHeading}>Disclosures</h1>
            <p className={Styles.subHeading}>
              Effective Date: June 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>1. No Investment Advice</h2>
                <p className={Styles.sectionText}>
                  Trade Diary does not provide investment, trading, or financial advice. The journal, analytics, 
                  and summaries are based on user-input data and are strictly for informational and educational purposes. 
                  We do not offer stock recommendations, tips, or market predictions. Users are encouraged to conduct 
                  their own research or consult a licensed financial advisor before making trading decisions.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>2. Market Risks</h2>
                <p className={Styles.sectionText}>
                  Trading and investing in the financial markets involves significant risk, including the potential 
                  loss of capital. Trade Diary makes no claims or guarantees regarding performance improvement, 
                  accuracy of trade insights, or market profitability. Past results or patterns logged in the journal 
                  are not indicative of future outcomes.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>3. Accuracy & Reliability of Data</h2>
                <p className={Styles.sectionText}>
                  While we aim to provide stable and accurate performance summaries based on the data users enter, 
                  Trade Diary is not responsible for data entry errors, system bugs, or any inaccuracies in generated metrics. 
                  Technical issues, data loss, or downtime may occur without prior notice.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>4. No Liability</h2>
                <p className={Styles.sectionText}>
                  Trade Diary, its developers, affiliates, or team members are not liable for any financial loss, 
                  trading decisions, or consequences that arise from using the platform. Users are solely responsible 
                  for how they interpret or act upon the data recorded and displayed in their journal.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>5. Third-Party Integrations & Links</h2>
                <p className={Styles.sectionText}>
                  Our platform may include optional integrations or links to external platforms (e.g., brokers, data APIs). 
                  These are provided for convenience only. Trade Diary does not control or endorse third-party content, 
                  and is not responsible for any issues that arise from using external services.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>6. Subscription & Payments</h2>
                <p className={Styles.sectionText}>
                  All subscriptions to Trade Diary are final and non-refundable. We do not guarantee trading success, 
                  profitability, or any specific outcome as a result of using our platform. Users are advised to review 
                  our Refund & Cancellation Policy before making a purchase.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>7. Policy Updates</h2>
                <p className={Styles.sectionText}>
                  Trade Diary reserves the right to modify this disclosure statement at any time. Updates will be reflected 
                  on this page, and continued use of the platform constitutes acceptance of the revised terms.
                </p>
                <p className={Styles.sectionText}>
                  By accessing or using Trade Diary, you confirm that you have read, understood, and agreed to the terms 
                  outlined in this disclosure.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Us</h2>
                <p className={Styles.sectionText}>
                  For questions or concerns, feel free to reach out to us:
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

export default Disclosures;
