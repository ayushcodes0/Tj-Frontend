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
              Last updated: September 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>No Refund Policy</h2>
                <p className={Styles.sectionText}>
                  All payments made for TradeJournalAI Pro subscription (₹99) are final and non-refundable. Once payment is processed, you gain immediate access to our dashboard, analysis tools, and all premium features provided by Deepanshu Yadav.
                </p>
                <p className={Styles.sectionText}>
                  Due to the digital nature of our service and instant access provided upon payment, refunds cannot be issued under any circumstances.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>24-Hour Free Trial</h2>
                <p className={Styles.sectionText}>
                  We provide all new users with 24 hours of free access to our complete dashboard and analysis features upon registration. This trial period allows you to fully evaluate our platform before making a purchase decision.
                </p>
                <p className={Styles.sectionText}>
                  We strongly encourage users to thoroughly test all features during this trial period, including entering sample trade data and exploring our analysis tools, charts, and reports developed by Deepanshu Yadav.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Subscription Access</h2>
                <p className={Styles.sectionText}>
                  After purchasing the ₹99 Pro subscription, you will have continued access to log trades, view detailed performance analytics, risk analysis, psychology tracking, monthly reports, and streak tracking features.
                </p>
                <p className={Styles.sectionText}>
                  Your subscription remains active until you choose to discontinue using the platform. There are no automatic renewals or recurring charges unless explicitly stated at the time of purchase.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Service Understanding</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI is a manual trade logging and analysis platform developed by Deepanshu Yadav. Users must enter their own trade data through our forms to generate performance reports, charts, and analytics. 
                </p>
                <p className={Styles.sectionText}>
                  We do not provide trading advice, signals, or guaranteed profits. Our platform is purely for tracking and analyzing trading performance based on user-input data.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Technical Support</h2>
                <p className={Styles.sectionText}>
                  If you experience technical difficulties accessing your dashboard or using our features after payment, please contact Deepanshu Yadav's support team immediately for assistance.
                </p>
                <p className={Styles.sectionText}>
                  Technical issues will be resolved promptly, but they do not constitute grounds for refunds as per this policy.
                </p>
              </section>


              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Pre-Purchase Considerations</h2>
                <p className={Styles.sectionText}>
                  Before purchasing, please ensure you understand that our platform requires manual trade data entry and is designed for performance tracking and analysis only. Take full advantage of your 24-hour trial period.
                </p>
                <p className={Styles.sectionText}>
                  Review our features thoroughly: trade logging forms, performance charts, risk analysis, psychology tracking, monthly analysis with calendar view, and streak tracking.
                </p>
              </section>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Contact Information</h2>
                <p className={Styles.sectionText}>
                  For questions about billing, technical support, or our services, please contact:
                </p>
                <address className={Styles.contactInfo}>
                  Email: tradejournal.ai@gmail.com<br />
                  Phone: +91 9339682864<br />
                  Address: COCOON COWORKS NO 757, 15th main, 7th cross, BTM 2nd stage. Bangalore South-560076<br />
                  Website: https://tradejournalai.in
                </address>
                <p className={Styles.sectionText}>
                  This policy may be updated periodically by Deepanshu Yadav. The current version will always be available on our website.
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
