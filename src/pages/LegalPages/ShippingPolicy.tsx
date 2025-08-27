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
              Effective Date: August 2025
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Web-Based Platform Only</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI is exclusively a web-based trading journal platform accessible through tradejournalai.in. We provide digital services only - no physical products are sold, shipped, or delivered.
                </p>
                <p className={Styles.sectionText}>
                  All features including trade logging forms, dashboard analytics, performance charts, risk analysis, and monthly reports are delivered electronically through your web browser.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Immediate Access After Payment</h2>
                <p className={Styles.sectionText}>
                  Upon successful payment of the ₹99 Pro subscription, you will receive immediate access to your dashboard. There is no waiting period or processing delay for accessing our trade logging and analysis features.
                </p>
                <p className={Styles.sectionText}>
                  You can start entering your trade data and generating performance analysis immediately after payment confirmation.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>24-Hour Free Trial Access</h2>
                <p className={Styles.sectionText}>
                  New registrations automatically receive 24 hours of free access to our complete dashboard, including all analysis tools, charts, and reporting features.
                </p>
                <p className={Styles.sectionText}>
                  During your trial period, you can explore trade logging, performance analytics, risk analysis, psychology tracking, monthly analysis, and streak tracking without any restrictions.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Account Confirmation</h2>
                <p className={Styles.sectionText}>
                  After registration or subscription purchase, you will receive email confirmation containing:
                </p>
                <p className={Styles.sectionText}>
                  • Account activation details<br />
                  • Dashboard access instructions<br />
                  • Getting started guide for trade logging<br />
                  • Payment receipt (for paid subscriptions)
                </p>
                <p className={Styles.sectionText}>
                  If confirmation emails are not received within 15 minutes, please check your spam folder or contact support.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Platform Features Delivery</h2>
                <p className={Styles.sectionText}>
                  All TradeJournalAI features are delivered instantly through our web platform:
                </p>
                <p className={Styles.sectionText}>
                  • Trade logging forms and data entry<br />
                  • Performance analysis charts and graphs<br />
                  • Detailed risk analysis tools<br />
                  • Psychology tracking features<br />
                  • Monthly analysis with calendar view<br />
                  • Trading streak tracking and statistics
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>No Shipping Costs or Delays</h2>
                <p className={Styles.sectionText}>
                  Since TradeJournalAI is entirely web-based, there are no shipping fees, delivery charges, or geographical restrictions. The ₹99 subscription fee is the only cost - no additional charges apply.
                </p>
                <p className={Styles.sectionText}>
                  Users worldwide can access our platform immediately upon registration or payment, without any delivery delays or shipping considerations.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Future Broker Integration</h2>
                <p className={Styles.sectionText}>
                  We plan to introduce broker API integrations in the future to allow automatic trade logging. When available, these features will be delivered digitally through platform updates - no additional shipping or installation required.
                </p>
                <p className={Styles.sectionText}>
                  Current subscribers will be notified of new features through email and platform announcements.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Technical Support</h2>
                <p className={Styles.sectionText}>
                  For assistance with platform access, trade logging, or dashboard features:
                </p>
                <address className={Styles.contactInfo}>
                  Email: support@tradejournalai.in<br />
                  Website: https://tradejournalai.in
                </address>
                <p className={Styles.sectionText}>
                  All support is provided digitally through email correspondence. No physical documentation or materials are shipped.
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
