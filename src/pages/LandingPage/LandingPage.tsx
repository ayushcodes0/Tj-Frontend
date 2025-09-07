import { FilledButton } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import Styles from './LandingPage.module.css';
// import HeroSectionImage from '../../assets/image/heroSectionImage.png';
import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Pricing from '../../components/Pricing/Pricing';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Variants } from "framer-motion";
import { IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { NavLink } from 'react-router-dom';
import { FaBrain, FaLightbulb, FaChartLine, FaShieldAlt } from "react-icons/fa";
// import { SiZerodha } from "react-icons/si";
// import { BsLightningChargeFill } from "react-icons/bs";

// Mock images - you'll need to replace these with actual images
// import brokerageImage from "../../assets/image/brokerage-mock.png";
import howItWorksImage from "../../assets/image/how-it-works-mock.png";
import aiPoweredImage from "../../assets/image/ai-powerd-mock.png";
import zerodhaLogo from "../../assets/image/zerodha.svg";
import angelOneLogo from "../../assets/image/angelone.png";
import upstoxLogo from "../../assets/image/upstox.png";
import fivePaisaLogo from "../../assets/image/5paisa.svg";
import growwLogo from "../../assets/image/groww.png";
import dhanLogo from "../../assets/image/dhan.png";
import paytmMoneyLogo from "../../assets/image/paytm-money.png";
import { FaPlus, FaMinus } from 'react-icons/fa';
import { BsLightningChargeFill } from "react-icons/bs";

const sectionVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 50
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const imageVariants: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.9
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

// const imageRotate: Variants = {
//   hidden: { opacity: 0, rotate: -20, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     rotate: 0,
//     scale: 1,
//     transition: {
//       delay: 0.3,
//       duration: 0.8,
//       ease: [0.16, 0.77, 0.47, 0.97]
//     }
//   }
// };

const LandingPage = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const controls = useAnimation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  console.log(isMobileView);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 883);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [inView, controls, hasAnimated]);

  const steps = [
    {
      icon: <IoNewspaperOutline />,
      title: "Log Your Trades",
      description: "Quickly record every trade with all essential details"
    },
    {
      icon: <FaBrain />,
      title: "Get AI Insights",
      description: "Our algorithms analyze your patterns and performance"
    },
    {
      icon: <HiOutlineTrendingUp />,
      title: "Improve Your Strategy",
      description: "Implement data-driven changes to boost profitability"
    }
  ];

  const features = [
    {
      icon: <FaChartLine />,
      title: "Performance Analytics",
      description: "Track win rate, profit factor, and other key metrics"
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Management",
      description: "Identify risk patterns and improve money management"
    },
    {
      icon: <FaLightbulb />,
      title: "Pattern Recognition",
      description: "Discover your most profitable setups and strategies"
    }
  ];

  return (
    <div className={Styles.landingPageContainer}> 
      <div className={Styles.landingPageHero}>
        <div className={Styles.navbarContainer}>
          <Navbar />
        </div>
        <div className={Styles.heroSection} ref={ref}>
          <div className={Styles.heroContent}>
            <h1 className={Styles.heroTitle}>Your Trading Journey<br />Starts Here</h1>
            <p className={Styles.heroSubtitle}>
              Professional-grade trade journaling for serious traders. Track, analyze, and optimize your trading performance with precision.
            </p>
            <div className={Styles.heroCta}>
              <NavLink to={"/register"}><FilledButton text='Open Dashboard →' /></NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Everything You Need Section */}
      {/* Everything You Need Section */}
      <motion.section 
        className={Styles.everythingSection}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>Everything You Need to Trade Better</h2>
            <p>Powerful features designed by traders, for traders</p>
          </div>
          
          <div className={Styles.featuresGrid}>
            <div className={Styles.featureCard}>
              <div className={Styles.featureIcon}>
                <FaChartLine />
              </div>
              <h3>Advanced Analytics</h3>
              <p>Track your performance with detailed charts and metrics</p>
            </div>
            
            <div className={Styles.featureCard}>
              <div className={Styles.featureIcon}>
                <FaShieldAlt />
              </div>
              <h3>Secure & Private</h3>
              <p>Your trading data is encrypted and completely private</p>
            </div>
            
            <div className={Styles.featureCard}>
              <div className={Styles.featureIcon}>
                <BsLightningChargeFill />
              </div>
              <h3>Lightning Fast</h3>
              <p>Log trades quickly with our streamlined interface</p>
            </div>
            
            <div className={Styles.featureCard}>
              <div className={Styles.featureIcon}>
                <HiOutlineTrendingUp />
              </div>
              <h3>Strategy Tracking</h3>
              <p>Monitor which strategies work best for you</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Brokerage Integration Section */}
      <motion.section 
        className={Styles.brokerageSection}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>Works with your broker</h2>
            <p>Connect seamlessly with your preferred trading platform</p>
          </div>
          
          <div className={Styles.brokerMarquee}>
            <div className={Styles.marqueeContent}>
              {/* First set of logos */}
              <div className={Styles.brokerItem}>
                <img src={zerodhaLogo} alt="Zerodha" className={Styles.brokerLogo} />
                <span>Zerodha</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={angelOneLogo} alt="Angel One" className={Styles.brokerLogo} />
                <span>Angel One</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={upstoxLogo} alt="Upstox" className={Styles.brokerLogo} />
                <span>Upstox</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={fivePaisaLogo} alt="5paisa" className={Styles.brokerLogo} />
                <span>5paisa</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={growwLogo} alt="Groww" className={Styles.brokerLogo} />
                <span>Groww</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={dhanLogo} alt="Dhan" className={Styles.brokerLogo} />
                <span>Dhan</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={paytmMoneyLogo} alt="Paytm Money" className={Styles.brokerLogo} />
                <span>Paytm Money</span>
              </div>
              
              {/* Duplicated set for seamless looping */}
              <div className={Styles.brokerItem}>
                <img src={zerodhaLogo} alt="Zerodha" className={Styles.brokerLogo} />
                <span>Zerodha</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={angelOneLogo} alt="Angel One" className={Styles.brokerLogo} />
                <span>Angel One</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={upstoxLogo} alt="Upstox" className={Styles.brokerLogo} />
                <span>Upstox</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={fivePaisaLogo} alt="5paisa" className={Styles.brokerLogo} />
                <span>5paisa</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={growwLogo} alt="Groww" className={Styles.brokerLogo} />
                <span>Groww</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={dhanLogo} alt="Dhan" className={Styles.brokerLogo} />
                <span>Dhan</span>
              </div>
              <div className={Styles.brokerItem}>
                <img src={paytmMoneyLogo} alt="Paytm Money" className={Styles.brokerLogo} />
                <span>Paytm Money</span>
              </div>
            </div>
          </div>
          
          <div className={Styles.comingSoonContainer}>
            <div className={Styles.comingSoonBadge}>Coming Soon</div>
            <p>We're working on API integrations with these brokers</p>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className={Styles.howItWorksSection}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Transform your trading in three simple steps</p>
          </div>
          
          <div className={Styles.stepsContainer}>
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={Styles.stepCard}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                transition={{ delay: index * 0.2 }}
              >
                <div className={Styles.stepNumber}>{index + 1}</div>
                <div className={Styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className={Styles.howItWorksImageContainer}
            variants={imageVariants}
          >
            <img src={howItWorksImage} alt="How It Works" className={Styles.sectionImage} />
          </motion.div>
        </div>
      </motion.section>

      {/* AI Powered Section */}
      <motion.section 
        className={Styles.aiPoweredSection}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>AI-Powered Trading Insights</h2>
            <p>Our AI analyzes your trading to deliver personalized insights that transform your results</p>
          </div>
          
          <div className={Styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={Styles.featureCard}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                transition={{ delay: index * 0.1 }}
              >
                <div className={Styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className={Styles.aiImageContainer}
            variants={imageVariants}
          >
            <img src={aiPoweredImage} alt="AI Powered Insights" className={Styles.sectionImage} />
          </motion.div>
          
          <div className={Styles.ctaBox}>
            <h3>Ready to transform your trading?</h3>
            <p>Join thousands of traders who are already improving their performance</p>
            <NavLink to={"/register"}><FilledButton text="Start Your Free Trial" /></NavLink>
          </div>
        </div>
      </motion.section>

      <div className={Styles.pricingContainer}>
        <Pricing />
      </div>

      {/* FAQ Section */}
      <motion.section 
        className={Styles.faqSection}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about TradeJournal.ai</p>
          </div>
          
          <div className={Styles.faqContainer}>
            <div className={Styles.faqItem}>
              <div 
                className={Styles.faqQuestion} 
                onClick={() => toggleFaq(0)}
              >
                <h3>What is tradejournal.ai?</h3>
                <div className={Styles.faqIcon}>
                  {openFaqIndex === 0 ? <FaMinus /> : <FaPlus />}
                </div>
              </div>
              <div className={`${Styles.faqAnswerWrapper} ${openFaqIndex === 0 ? Styles.faqOpen : ''}`}>
                <div className={Styles.faqAnswer}>
                  <p>Tradejournal.ai is designed to help serious traders with data-driven insights, analyzing profit/loss factors, and improve their performance through journaling, visual analytics, AI insights & psychology tracking that you can't get with spreadsheets or notes.</p>
                </div>
              </div>
            </div>
            
            <div className={Styles.faqItem}>
              <div 
                className={Styles.faqQuestion} 
                onClick={() => toggleFaq(1)}
              >
                <h3>Is my trading data secured?</h3>
                <div className={Styles.faqIcon}>
                  {openFaqIndex === 1 ? <FaMinus /> : <FaPlus />}
                </div>
              </div>
              <div className={`${Styles.faqAnswerWrapper} ${openFaqIndex === 1 ? Styles.faqOpen : ''}`}>
                <div className={Styles.faqAnswer}>
                  <p>Yes, data security is our top priority. All your trading data is encrypted & stored securely. YOUR TRADING DATA IS NEVER SHARED WITH THIRD-PARTIES. You can also enable 2FA authentication for additional security.</p>
                </div>
              </div>
            </div>
            
            <div className={Styles.faqItem}>
              <div 
                className={Styles.faqQuestion} 
                onClick={() => toggleFaq(2)}
              >
                <h3>How does tradejournal.ai help improve my trading?</h3>
                <div className={Styles.faqIcon}>
                  {openFaqIndex === 2 ? <FaMinus /> : <FaPlus />}
                </div>
              </div>
              <div className={`${Styles.faqAnswerWrapper} ${openFaqIndex === 2 ? Styles.faqOpen : ''}`}>
                <div className={Styles.faqAnswer}>
                  <p>By providing tools to log every trade, analyze detailed data-driven performance metrics, identify patterns, eliminate weaknesses, journal empowers you to make data-driven decisions & refine your trading strategies for better results.</p>
                </div>
              </div>
            </div>
            
            <div className={Styles.faqItem}>
              <div 
                className={Styles.faqQuestion} 
                onClick={() => toggleFaq(3)}
              >
                <h3>How much does it cost?</h3>
                <div className={Styles.faqIcon}>
                  {openFaqIndex === 3 ? <FaMinus /> : <FaPlus />}
                </div>
              </div>
              <div className={`${Styles.faqAnswerWrapper} ${openFaqIndex === 3 ? Styles.faqOpen : ''}`}>
                <div className={Styles.faqAnswer}>
                  <p>Our annual plan offers significant savings. At just ₹66/month (billed annually @ ₹799) or monthly plan @ just ₹99. Plus you lock in current price even if we increase in future.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className={Styles.footerContainer}>
        <Footer /> 
      </div>
    </div>
  );
};

export default LandingPage;