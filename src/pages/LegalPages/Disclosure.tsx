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
            <h1 className={Styles.mainHeading}>Legal Disclosures</h1>
            <p className={Styles.subHeading}>
              Effective Date: September 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>1. Service Nature and Scope</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI is a web-based platform that provides trade logging and performance analysis tools. We are not a financial advisor, investment company, broker-dealer, or registered investment advisor.
                </p>
                <p className={Styles.sectionText}>
                  Our platform allows users to manually enter their trading data and generates performance analytics, charts, and reports based solely on user-input information. We do not provide investment advice, trading recommendations, or market analysis.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>2. Manual Data Entry Requirement</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI requires users to manually input all trade information through our forms. Our platform does not automatically import trades, connect to brokerage accounts, or retrieve market data (though broker integrations may be available in the future).
                </p>
                <p className={Styles.sectionText}>
                  New users will find their dashboard empty until they begin entering their trade data. All analysis and reporting is dependent on the accuracy and completeness of user-entered information.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>3. No Performance Guarantees</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI does not guarantee improved trading performance, increased profits, reduced losses, or any specific trading outcomes from using our platform. Our tools are designed for tracking and analysis purposes only.
                </p>
                <p className={Styles.sectionText}>
                  Past performance data tracked in our platform does not predict future results. Individual results will vary based on market conditions, trading decisions, and data accuracy.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>4. Pricing and Subscription Model</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI offers a 24-hour free trial for all new registrations, followed by a ₹99 Pro subscription for continued access to all features. All payments are final and non-refundable.
                </p>
                <p className={Styles.sectionText}>
                  The subscription provides access to trade logging, performance analytics, risk analysis, psychology tracking, monthly reports, and streak tracking. No additional features or trading success are guaranteed with subscription purchase.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>5. Data Accuracy and Reliability</h2>
                <p className={Styles.sectionText}>
                  While we strive to provide accurate calculation algorithms and reliable platform performance, TradeJournalAI is not responsible for data entry errors, calculation mistakes, or technical issues that may affect your analysis.
                </p>
                <p className={Styles.sectionText}>
                  Users are responsible for verifying the accuracy of their data inputs and should independently verify all calculations and analysis results before making any trading decisions.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>6. Future Feature Development</h2>
                <p className={Styles.sectionText}>
                  We may introduce broker API integrations, additional analysis tools, or other features in the future. Such features will be optional and may require separate terms of service or additional subscription fees.
                </p>
                <p className={Styles.sectionText}>
                  Current subscribers are not guaranteed access to future features without additional payment or agreement to updated terms and conditions.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>7. Platform Features and Limitations</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI provides the following features based on user-input data: trade logging forms, performance charts and graphs, detailed risk analysis, psychology tracking tools, monthly analysis with calendar view, and trading streak statistics.
                </p>
                <p className={Styles.sectionText}>
                  All features depend on manual data entry and may not function properly without complete and accurate trade information. We do not provide real-time market data, live trading capabilities, or automated trading systems.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>8. User Responsibility and Risk</h2>
                <p className={Styles.sectionText}>
                  Users are solely responsible for their trading decisions, data accuracy, and any consequences arising from platform usage. Trading involves significant financial risk, and users should never rely solely on our analysis tools for investment decisions.
                </p>
                <p className={Styles.sectionText}>
                  We recommend consulting qualified financial professionals before making any trading or investment decisions, regardless of insights provided by our platform.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>9. Limitation of Liability</h2>
                <p className={Styles.sectionText}>
                  To the maximum extent permitted by law, TradeJournalAI and its operators shall not be liable for any trading losses, missed opportunities, data inaccuracies, or other damages arising from platform usage or reliance on our analysis tools.
                </p>
                <p className={Styles.sectionText}>
                  Our maximum liability is limited to the subscription fees paid by users. Users agree to use our platform at their own risk for educational and tracking purposes only.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Information</h2>
                <p className={Styles.sectionText}>
                  For questions regarding these disclosures or our services:
                </p>
                <address className={Styles.contactInfo}>
                  Email: tradejournal.ai@gmail.com<br />
                  Phone: +91 9339682864<br />
                  Address: COCOON COWORKS NO 757, 15th main, 7th cross, BTM 2nd stage. Bangalore South-560076<br />
                  Website: https://tradejournalai.in
                </address>
                <p className={Styles.sectionText}>
                  These disclosures may be updated periodically. The most current version will always be available on our website with the effective date clearly displayed.
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
