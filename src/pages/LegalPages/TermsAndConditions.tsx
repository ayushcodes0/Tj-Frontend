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
              Last Updated: September 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>1. Agreement to Terms</h2>
                <p className={Styles.sectionText}>
                  Welcome to TradeJournalAI. By accessing tradejournalai.in or using our trading journal dashboard, you agree to be bound by these Terms and Conditions. Please read these terms carefully before registering or using our services.
                </p>
                <p className={Styles.sectionText}>
                  By creating an account, entering trade data, or subscribing to our services, you confirm that you accept these terms and agree to comply with them.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>2. Service Description</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI provides a web-based trading journal platform where users can manually log their trades, analyze their trading performance through detailed charts and graphs, and track their progress over time.
                </p>
                <p className={Styles.sectionText}>
                  Our services include: trade logging forms, performance analysis dashboards, risk analysis tools, psychology tracking, monthly analysis with calendar view, streak tracking, and detailed profit/loss analytics. We are purely a data tracking and analysis tool.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>3. Trial and Subscription Model</h2>
                <p className={Styles.sectionText}>
                  New users receive 24 hours of free access to our dashboard upon registration. After the trial period expires, continued access requires purchasing our Pro subscription at ₹99.
                </p>
                <p className={Styles.sectionText}>
                  The subscription provides full access to all dashboard features including detailed analysis, risk management tools, psychology tracking, and monthly performance reports.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>4. User Data and Input Responsibility</h2>
                <p className={Styles.sectionText}>
                  Users are entirely responsible for manually entering accurate trade data into our platform. All analysis, charts, and performance metrics are based solely on the information you provide through our trade logging forms.
                </p>
                <p className={Styles.sectionText}>
                  We do not verify the accuracy of your trade entries. Incorrect data input will result in inaccurate analysis and reports. You are responsible for maintaining the accuracy of all entered information.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>5. No Investment Advice or Trading Services</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI is strictly a data logging and analysis platform. We do not provide investment advice, trading signals, stock recommendations, or financial consulting services of any kind.
                </p>
                <p className={Styles.sectionText}>
                  Our charts, graphs, and analysis tools are for personal performance tracking only. All trading decisions remain entirely your own responsibility.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>6. Account Access and Security</h2>
                <p className={Styles.sectionText}>
                  You must provide accurate registration information and maintain the security of your account credentials. You are responsible for all activity that occurs under your account.
                </p>
                <p className={Styles.sectionText}>
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in suspicious activity.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>7. Payment Terms</h2>
                <p className={Styles.sectionText}>
                  Our Pro subscription costs ₹99 and provides ongoing access to the dashboard and all analysis features. All payments are processed securely and are non-refundable once processed.
                </p>
                <p className={Styles.sectionText}>
                  Subscription fees must be paid in advance. We reserve the right to modify pricing with advance notice to existing subscribers.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>8. Future Features and Integrations</h2>
                <p className={Styles.sectionText}>
                  We may introduce additional features such as broker API integrations for automated trade logging in the future. Such features will be optional and subject to separate terms and conditions.
                </p>
                <p className={Styles.sectionText}>
                  Current subscribers will be notified of new features, but access may require additional fees or subscription upgrades.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>9. Service Availability</h2>
                <p className={Styles.sectionText}>
                  While we strive to maintain high uptime for our dashboard, we do not guarantee uninterrupted service availability. Maintenance, updates, or technical issues may temporarily affect access.
                </p>
                <p className={Styles.sectionText}>
                  We are not liable for any losses or inconveniences caused by service interruptions or data processing delays.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>10. Data Analysis Limitations</h2>
                <p className={Styles.sectionText}>
                  Our analysis tools, charts, and performance metrics are based entirely on user-input data. We make no guarantees about the accuracy of calculations or the effectiveness of our analysis algorithms.
                </p>
                <p className={Styles.sectionText}>
                  Users should independently verify all analysis results and not rely solely on our platform for trading decisions or performance evaluation.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>11. Limitation of Liability</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI and its operators shall not be liable for any trading losses, missed opportunities, data loss, or other damages arising from platform usage or reliance on our analysis tools.
                </p>
                <p className={Styles.sectionText}>
                  Our maximum liability is limited to the amount of subscription fees paid by the user in the twelve months preceding any claim.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>12. Governing Law</h2>
                <p className={Styles.sectionText}>
                  These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Bengaluru, Karnataka, India.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>13. Contact Information</h2>
                <p className={Styles.sectionText}>
                  For questions about these terms or our services:
                </p>
                <address className={Styles.contactInfo}>
                  Email: tradejournalai@gmail.com<br />
                  Phone: +91 9999999999<br />
                  Address: Bengaluru, Karnataka, India<br />
                  Website: https://tradejournalai.in
                </address>
                <p className={Styles.sectionText}>
                  These terms may be updated periodically. Continued use of our platform constitutes acceptance of any changes.
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
