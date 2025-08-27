import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Styles from './TermsAndConditions.module.css';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Define animation variants for a modern feel
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

const TermsAndConditions: React.FC = () => {
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
            <h1 className={Styles.mainHeading}>Terms and Conditions</h1>
            <p className={Styles.subHeading}>
              Last Updated: September 15, 2023. Please read these terms carefully before using our services.
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>1. Acceptance of Terms</h2>
                <p className={Styles.sectionText}>
                  By accessing or using TradeInsights ("the Service"), a trade journal website operated by 
                  TradeInsights Inc. ("us", "we", or "our"), you agree to be bound by these Terms and Conditions 
                  ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>2. Description of Service</h2>
                <p className={Styles.sectionText}>
                  TradeInsights provides a platform for traders to log their trade details and receive insights 
                  and analytics based on their trading activity. Our service includes:
                </p>
                <ul className={Styles.list}>
                  <li className={Styles.listItem}>Trade entry and management tools</li>
                  <li className={Styles.listItem}>Performance analytics and visualization</li>
                  <li className={Styles.listItem}>Custom reporting features</li>
                  <li className={Styles.listItem}>Educational content related to trading</li>
                </ul>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>3. User Accounts</h2>
                <p className={Styles.sectionText}>
                  When you create an account with us, you must provide accurate, complete, and current 
                  information. Failure to do so constitutes a breach of the Terms, which may result in 
                  immediate termination of your account.
                </p>
                <p className={Styles.sectionText}>
                  You are responsible for safeguarding the password that you use to access the Service and 
                  for any activities or actions under your password. You agree not to disclose your password 
                  to any third party.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>4. User Content</h2>
                <p className={Styles.sectionText}>
                  Our Service allows you to post, link, store, share and otherwise make available certain 
                  information, text, graphics, or other material ("Content"). You are responsible for the 
                  Content that you post to the Service, including its legality, reliability, and appropriateness.
                </p>
                <p className={Styles.sectionText}>
                  By posting Content to the Service, you grant us the right and license to use, modify, 
                  publicly perform, publicly display, reproduce, and distribute such Content on and through 
                  the Service for the purpose of providing the Service to you. You retain any and all of your 
                  rights to any Content you submit, post or display on or through the Service.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>5. Prohibited Uses</h2>
                <p className={Styles.sectionText}>You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
                <ul className={Styles.list}>
                  <li className={Styles.listItem}>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                  <li className={Styles.listItem}>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way</li>
                  <li className={Styles.listItem}>To send, knowingly receive, upload, download, use, or re-use any material which does not comply with these Terms</li>
                  <li className={Styles.listItem}>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                  <li className={Styles.listItem}>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                  <li className={Styles.listItem}>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                </ul>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>6. Analytics and Insights</h2>
                <p className={Styles.sectionText}>
                  The insights, analytics, and recommendations provided by our Service are generated based on 
                  the data you input and are for informational purposes only. These should not be construed as 
                  financial advice, investment recommendations, or an endorsement of any particular security, 
                  trading strategy, or investment product.
                </p>
                <p className={Styles.sectionText}>
                  You understand and acknowledge that trading financial instruments involves substantial risk 
                  of loss and is not suitable for all investors. You are solely responsible for your trading 
                  decisions and outcomes.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>7. Intellectual Property</h2>
                <p className={Styles.sectionText}>
                  The Service and its original content, features, and functionality are and will remain the 
                  exclusive property of TradeInsights Inc. and its licensors. The Service is protected by 
                  copyright, trademark, and other laws of both the United States and foreign countries.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>8. Links To Other Web Sites</h2>
                <p className={Styles.sectionText}>
                  Our Service may contain links to third-party web sites or services that are not owned or 
                  controlled by TradeInsights Inc. We have no control over, and assume no responsibility for, 
                  the content, privacy policies, or practices of any third party web sites or services.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>9. Termination</h2>
                <p className={Styles.sectionText}>
                  We may terminate or suspend your account immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className={Styles.sectionText}>
                  Upon termination, your right to use the Service will immediately cease. If you wish to 
                  terminate your account, you may simply discontinue using the Service.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>10. Limitation of Liability</h2>
                <p className={Styles.sectionText}>
                  In no event shall TradeInsights Inc., nor its directors, employees, partners, agents, 
                  suppliers, or affiliates, be liable for any indirect, incidental, special, consequential 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses, resulting from:
                </p>
                <ul className={Styles.list}>
                  <li className={Styles.listItem}>Your access to or use of or inability to access or use the Service</li>
                  <li className={Styles.listItem}>Any conduct or content of any third party on the Service</li>
                  <li className={Styles.listItem}>Any content obtained from the Service</li>
                  <li className={Styles.listItem}>Unauthorized access, use or alteration of your transmissions or content</li>
                </ul>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>11. Disclaimer</h2>
                <p className={Styles.sectionText}>
                  Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and 
                  "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether 
                  express or implied, including, but not limited to, implied warranties of merchantability, 
                  fitness for a particular purpose, non-infringement or course of performance.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>12. Governing Law</h2>
                <p className={Styles.sectionText}>
                  These Terms shall be governed and construed in accordance with the laws of Delaware, 
                  United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>13. Changes to Terms</h2>
                <p className={Styles.sectionText}>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material we will provide at least 30 days' notice prior to any new terms 
                  taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>14. Contact Us</h2>
                <p className={Styles.sectionText}>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <address className={Styles.contactInfo}>
                  TradeInsights Inc.<br />
                  123 Trading Street, Suite 456<br />
                  New York, NY 10001<br />
                  Email: legal@tradeinsights.com<br />
                  Phone: (123) 456-7890
                </address>
              </section>
            </div>
          </motion.div>
        </motion.section>
      </main>
      <div className={Styles.footerContainer}><Footer /></div>
    </div>
  );
};

export default TermsAndConditions;