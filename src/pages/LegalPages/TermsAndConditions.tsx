import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Styles from './TermsAndConditions.module.css';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Define animation variants
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
            <h1 className={Styles.mainHeading}>Terms & Conditions</h1>
            <p className={Styles.subHeading}>
              Last Updated: June 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>1. Acceptance of Terms</h2>
                <p className={Styles.sectionText}>
                  Welcome to Trade Diary. By accessing or using our platform, you agree to comply with and be bound by the following Terms and Conditions. 
                  Please read them carefully before using our services.
                </p>
                <p className={Styles.sectionText}>
                  By using Trade Diary, you confirm that you have read, understood, and agreed to be legally bound by these Terms and Conditions, 
                  along with our Privacy Policy, Refund Policy, and Disclosure Statement.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>2. Nature of Services</h2>
                <p className={Styles.sectionText}>
                  Trade Diary is a digital journaling platform designed to help traders record, analyze, and reflect on their trading activity. 
                  We do not provide brokerage services, stock recommendations, investment advice, or any financial consulting.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>3. No Investment Advice</h2>
                <p className={Styles.sectionText}>
                  All features and tools provided on Trade Diary are strictly for personal documentation and educational use. 
                  Users should seek advice from a licensed financial advisor before making any trading or investment decisions. 
                  Trade Diary shall not be held liable for financial outcomes based on journal usage or interpretation.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>4. User Responsibility</h2>
                <p className={Styles.sectionText}>
                  You are solely responsible for the accuracy and completeness of the data you input and how you interpret the insights generated. 
                  Trade Diary is not responsible for any trading actions you take based on journal metrics or analytics. 
                  You agree not to hold us or our team liable for any resulting gains or losses.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>5. Intellectual Property</h2>
                <p className={Styles.sectionText}>
                  All content, branding, tools, code, and designs on the Trade Diary platform are the intellectual property of Trade Diary. 
                  Unauthorized copying, modification, distribution, or reproduction is strictly prohibited and may lead to legal action.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>6. Account & Access</h2>
                <p className={Styles.sectionText}>
                  Some features of Trade Diary require account creation and subscription. 
                  You agree to provide accurate information and keep your credentials secure. 
                  You are responsible for all activity under your account.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>7. Subscription & Payments</h2>
                <p className={Styles.sectionText}>
                  Subscriptions are non-refundable and non-transferable. By making a payment, you confirm that you have read and accepted our Refund & Cancellation Policy. 
                  Subscriptions will renew automatically unless canceled before the end of the billing cycle.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>8. Service Availability</h2>
                <p className={Styles.sectionText}>
                  We strive to maintain high platform uptime but do not guarantee uninterrupted access. 
                  Maintenance, technical issues, or upgrades may temporarily affect availability without prior notice.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>9. Modifications to Terms</h2>
                <p className={Styles.sectionText}>
                  Trade Diary reserves the right to modify or update these Terms at any time. 
                  Continued use of the platform after changes constitutes your acceptance of the revised terms.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>10. Third-Party Links & Integrations</h2>
                <p className={Styles.sectionText}>
                  Trade Diary may include optional integrations or links to third-party tools and services (e.g., broker APIs). 
                  We do not endorse or control external content and are not responsible for its accuracy, reliability, or security.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>11. Limitation of Liability</h2>
                <p className={Styles.sectionText}>
                  To the maximum extent allowed by law, Trade Diary and its team shall not be liable for any direct, indirect, incidental, 
                  or consequential damages arising from your use or inability to use the platform or related services.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>12. Governing Law</h2>
                <p className={Styles.sectionText}>
                  These Terms shall be governed by the laws of India, without regard to any conflicts of law principles.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>13. Contact Us</h2>
                <p className={Styles.sectionText}>
                  If you have any questions or concerns about these Terms, please contact us at:
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

export default TermsAndConditions;