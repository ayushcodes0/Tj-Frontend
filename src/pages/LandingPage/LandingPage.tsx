import { FilledButton } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import Styles from './LandingPage.module.css';
import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import { IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { NavLink } from 'react-router-dom';
import { FaBrain, FaLightbulb, FaChartLine, FaShieldAlt } from "react-icons/fa";
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
import PricingCard from '../../components/pricingCard/PricingCard';
import logo from '../../assets/image/Logo2.png'

const LandingPage = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  console.log(isMobileView);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 883);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Add this useEffect to your LandingPage component
  useEffect(() => {
    // Check if URL has #pricing hash and scroll to it
    if (window.location.hash === '#pricing') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        // Small timeout to ensure the page is fully rendered
        setTimeout(() => {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

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
        <div className={Styles.heroSection}>
          <div className={Styles.heroContent}>
            < div 
              className={Styles.heroLogoContainer}
            >
              <img src={logo} alt="Logo" className={Styles.heroLogo} />
            </ div>
            
            < h1 
              className={Styles.heroTitle}
            >
              Your Trading Journey<br />Starts Here
            </ h1>
            
            < p 
              className={Styles.heroSubtitle}
            >
              Professional-grade trade journaling for serious traders. Track, analyze, and optimize your trading performance with precision.
            </ p>
            
            < div 
              className={Styles.heroCta}
            >
              <NavLink to={"/register"}><FilledButton text='Open Dashboard →' /></NavLink>
            </ div>
          </div>
        </div>
      </div>

      {/* Everything You Need Section */}
      <section className={Styles.everythingSection}>
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
      </section>

      {/* Brokerage Integration Section */}
      <section className={Styles.brokerageSection}>
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
            <div className={Styles.comingSoonBadge}>
              <p>Coming Soon</p>
              <p>(Early access to premium users)</p>
            </div>
            
            <p>We're working on API integrations with these brokers</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={Styles.howItWorksSection}>
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Transform your trading in three simple steps</p>
          </div>
          
          <div className={Styles.stepsContainer}>
            {steps.map((step, index) => (
              <div 
                key={index}
                className={Styles.stepCard}
              >
                <div className={Styles.stepNumber}>{index + 1}</div>
                <div className={Styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className={Styles.howItWorksImageContainer}>
            <img src={howItWorksImage} alt="How It Works" className={Styles.sectionImage} />
          </div>
        </div>
      </section>

      {/* AI Powered Section */}
      <section className={Styles.aiPoweredSection}>
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>AI-Powered Trading Insights</h2>
            <p>Our AI analyzes your trading to deliver personalized insights that transform your results</p>
          </div>
          
          <div className={Styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className={Styles.featureCard}
              >
                <div className={Styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className={Styles.aiImageContainer}>
            <img src={aiPoweredImage} alt="AI Powered Insights" className={`${Styles.sectionImage} ${Styles.sectionImage2}`} />
          </div>
          
          <div className={Styles.ctaBox}>
            <h3>Ready to transform your trading?</h3>
            <p>Join thousands of traders who are already improving their performance</p>
            <NavLink to={"/register"}><FilledButton text="Start Your Free Trial →" /></NavLink>
          </div>
        </div>
      </section>

      <div id='pricing' className={Styles.pricingContainer}>
        <PricingCard />
      </div>

      {/* FAQ Section */}
      <section className={Styles.faqSection}>
        <div className={Styles.sectionContainer}>
          <div className={Styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about tradejournalai.in</p>
          </div>
          
          <div className={Styles.faqContainer}>
            <div className={Styles.faqItem}>
              <div 
                className={Styles.faqQuestion} 
                onClick={() => toggleFaq(0)}
              >
                <h3>What is tradejournalai.in?</h3>
                <div className={Styles.faqIcon}>
                  {openFaqIndex === 0 ? <FaMinus /> : <FaPlus />}
                </div>
              </div>
              <div className={`${Styles.faqAnswerWrapper} ${openFaqIndex === 0 ? Styles.faqOpen : ''}`}>
                <div className={Styles.faqAnswer}>
                  <p>tradejournalai.in is designed to help serious traders with data-driven insights, analyzing profit/loss factors, and improve their performance through journaling, visual analytics, AI insights & psychology tracking that you can't get with spreadsheets or notes.</p>
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
                <h3>How does tradejournalai.in help improve my trading?</h3>
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
      </section>

      <div className={Styles.footerContainer}>
        <Footer /> 
      </div>
    </div>
  );
};

export default LandingPage;