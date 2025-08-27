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
              Last updated: August 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Our Privacy Commitment</h2>
                <p className={Styles.sectionText}>
                  At TradeJournalAI, we are committed to protecting your privacy and securing your trading data. This policy explains how we collect, use, and protect your information when you use our trading journal platform.
                </p>
                <p className={Styles.sectionText}>
                  By using TradeJournalAI, you consent to the practices described in this policy. We handle your data responsibly and transparently.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Information We Collect</h2>
                <p className={Styles.sectionText}>
                  We collect information necessary to provide our trading journal and analysis services:
                </p>
                <p className={Styles.sectionText}>
                  <strong>Account Information:</strong> Email address, username, password (encrypted), and subscription status when you register for our platform.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Trading Journal Data:</strong> All trade information you manually enter through our forms including stock symbols, entry/exit prices, quantities, dates, profit/loss amounts, trading strategies, and psychological notes.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Usage Analytics:</strong> How you interact with our dashboard, which analysis tools you use, time spent on platform, and feature engagement patterns.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Technical Data:</strong> IP address, browser information, device type, and session data for security and platform optimization.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>How We Use Your Data</h2>
                <p className={Styles.sectionText}>Your information enables us to provide personalized trading analytics:</p>
                <p className={Styles.sectionText}>
                  • Process and display your manually entered trade data<br />
                  • Generate performance charts, graphs, and analysis reports<br />
                  • Calculate risk metrics and trading statistics<br />
                  • Provide psychology tracking and monthly analysis<br />
                  • Track trading streaks and performance trends<br />
                  • Improve our platform features and user experience<br />
                  • Provide customer support and technical assistance
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Data Processing and Analysis</h2>
                <p className={Styles.sectionText}>
                  Our platform processes your manually entered trading data to generate charts, performance metrics, risk analysis, and monthly reports. All calculations and analysis are performed on your individual data set.
                </p>
                <p className={Styles.sectionText}>
                  We may use aggregated and anonymized usage patterns to improve our analysis algorithms and platform features, but individual trading data is never shared or combined with other users' information.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Data Security and Storage</h2>
                <p className={Styles.sectionText}>
                  Your trading data is stored securely and is never shared with third parties. We implement standard security measures including encrypted connections and secure data storage to protect your information.
                </p>
                <p className={Styles.sectionText}>
                  Only you have access to your specific trading journal data through your secured account login. We do not sell, rent, or distribute your trading information to any external parties.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Information Sharing</h2>
                <p className={Styles.sectionText}>
                  We do not share your personal or trading data with third parties except in these limited circumstances:
                </p>
                <p className={Styles.sectionText}>
                  <strong>Legal Requirements:</strong> When required by law, court order, or government regulation.<br />
                  <strong>Platform Security:</strong> To investigate fraud, security breaches, or terms violations.<br />
                  <strong>Service Providers:</strong> Trusted technical services that help operate our platform under strict confidentiality agreements.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Your Data Rights</h2>
                <p className={Styles.sectionText}>You have complete control over your trading journal data:</p>
                <p className={Styles.sectionText}>
                  • <strong>Access:</strong> View all data we store about your account and trading entries<br />
                  • <strong>Modification:</strong> Edit or update your trade entries and account information anytime<br />
                  • <strong>Deletion:</strong> Request complete removal of your account and all associated trading data<br />
                  • <strong>Export:</strong> Download your trading data in a portable format<br />
                  • <strong>Correction:</strong> Update any inaccurate information in your profile or trade logs
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Future Broker Integrations</h2>
                <p className={Styles.sectionText}>
                  We plan to offer optional broker API integrations in the future for automated trade logging. When available, these integrations will be entirely optional and subject to additional privacy terms.
                </p>
                <p className={Styles.sectionText}>
                  Any broker integration will require explicit user consent and will follow strict security protocols to protect your brokerage account information.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Us</h2>
                <p className={Styles.sectionText}>
                  For questions about this Privacy Policy or your data:
                </p>
                <address className={Styles.contactInfo}>
                  Email: support@tradejournalai.in<br />
                  Website: https://tradejournalai.in
                </address>
                <p className={Styles.sectionText}>
                  We review and update this policy regularly. We'll notify users of any significant changes through email or platform notifications.
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
