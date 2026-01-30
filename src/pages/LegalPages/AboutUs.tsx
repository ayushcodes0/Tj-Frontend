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

const AboutUs: React.FC = () => {
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
            <h1 className={Styles.mainHeading}>About TradeJournalAI</h1>
            <p className={Styles.subHeading}>
              Empowering traders with intelligent analytics and comprehensive trade tracking
            </p>
          </motion.div>
          
          <motion.div className={Styles.termsContentContainer} variants={fadeUpItem}>
            <div className={Styles.termsContent}>
              
              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Our Mission</h2>
                <p className={Styles.sectionText}>
                  At TradeJournalAI, we believe every trader deserves access to professional-grade analytics and insights. Our mission is to democratize trading performance analysis by providing powerful, AI-enhanced tools that help traders of all levels understand their performance, identify patterns, and make data-driven improvements to their trading strategies.
                </p>
                <p className={Styles.sectionText}>
                  We transform raw trade data into meaningful insights, helping traders develop discipline, consistency, and long-term profitability through comprehensive performance tracking and psychological analysis.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>What We Do</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI is a comprehensive trade tracking and analytics platform designed specifically for individual traders and small trading teams. Our platform combines manual trade logging with advanced analytics to provide deep insights into trading performance, risk management, and psychological patterns.
                </p>
                <p className={Styles.sectionText}>
                  Key features include detailed performance analytics, risk-reward calculations, monthly calendar views, trading psychology analysis, and AI-powered insights that help identify strengths and areas for improvement in your trading approach.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Our Story</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI was born from the real challenges faced by independent traders who struggled to find affordable, comprehensive tools for tracking and analyzing their trading performance. As engineering students passionate about both technology and financial markets, we recognized the gap between expensive institutional tools and basic spreadsheet tracking.
                </p>
                <p className={Styles.sectionText}>
                  Founded in 2025, we started with a simple goal: create an intuitive platform that combines the power of modern web technologies with practical trading analytics. What began as a college project has evolved into a full-featured platform serving traders across India and beyond.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Why Choose TradeJournalAI</h2>
                <p className={Styles.sectionText}>
                  <strong>Affordable Professional Tools:</strong> Get institutional-quality analytics at just ₹99/month, making professional trade analysis accessible to retail traders.
                </p>
                <p className={Styles.sectionText}>
                  <strong>Comprehensive Analytics:</strong> From basic P&L tracking to advanced psychological analysis, we provide the complete picture of your trading performance with visual charts, calendars, and detailed reports.
                </p>
                <p className={Styles.sectionText}>
                  <strong>User-Centric Design:</strong> Built by traders, for traders. Our interface is intuitive, fast, and designed to help you log trades quickly and access insights effortlessly.
                </p>
                <p className={Styles.sectionText}>
                  <strong>AI-Powered Insights:</strong> Leverage artificial intelligence to identify patterns in your trading behavior, discover optimal trading times, and receive personalized recommendations for improvement.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Our Technology</h2>
                <p className={Styles.sectionText}>
                  TradeJournalAI is built using modern web technologies including React, Node.js, and MongoDB, ensuring a fast, reliable, and scalable platform. Our AI analytics engine processes your trade data to generate meaningful insights while maintaining the highest standards of data security and privacy.
                </p>
                <p className={Styles.sectionText}>
                  We're continuously developing new features, including planned broker API integrations, mobile applications, and enhanced AI capabilities to provide even deeper trading insights and automation options.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Our Commitment</h2>
                <p className={Styles.sectionText}>
                  We're committed to maintaining TradeJournalAI as a pure analytics and tracking platform. We never provide trading advice, recommendations, or signals. Instead, we focus on giving you the tools and insights you need to make your own informed decisions.
                </p>
                <p className={Styles.sectionText}>
                  Your data privacy and security are paramount. We use industry-standard encryption and security practices to protect your trading information, and we never share your data with third parties without your explicit consent.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Looking Forward</h2>
                <p className={Styles.sectionText}>
                  As we grow, our vision extends beyond individual trade tracking. We're building features for trading teams, developing mobile applications, and exploring partnerships with brokers to provide seamless trade import capabilities.
                </p>
                <p className={Styles.sectionText}>
                  Our roadmap includes advanced portfolio management tools, social trading features, and enhanced AI capabilities that will continue to set new standards for affordable, professional-grade trading analytics.
                </p>
              </section>

              <section className={Styles.section}>
                <h2 className={Styles.sectionHeading}>Get In Touch</h2>
                <p className={Styles.sectionText}>
                  We love hearing from our users and are always looking to improve. Whether you have questions, feedback, or feature requests, we're here to help.
                </p>
                <address className={Styles.contactInfo}>
                  Email: tradejournal.ai@gmail.com<br />
                  Phone: +91 9339682864<br />
                  Address: COCOON COWORKS NO 757, 15th main, 7th cross, BTM 2nd stage. Bangalore South-560076<br />
                  Website: https://tradejournalai.in
                </address>
                <p className={Styles.sectionText}>
                  Join our community of traders who are taking control of their trading performance with data-driven insights. Start your free 24-hour trial today and discover what TradeJournalAI can do for your trading journey.
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

export default AboutUs;
