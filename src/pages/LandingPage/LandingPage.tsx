import { FilledButton } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import Styles from './LandingPage.module.css';
import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';

import { NavLink } from 'react-router-dom';

import aiPoweredImage from "../../assets/image/ai-powerd-mock.png";
import zerodhaLogo from "../../assets/image/zerodha.svg";
import angelOneLogo from "../../assets/image/angelone.png";
import upstoxLogo from "../../assets/image/upstox.png";
import fivePaisaLogo from "../../assets/image/5paisa.svg";
import growwLogo from "../../assets/image/groww.png";
import dhanLogo from "../../assets/image/dhan.png";
import sahi from "../../assets/image/sahi.png";
import aliceblue from "../../assets/image/aliceblue.png";
import trackk from "../../assets/image/trackk.png";
import { FaPlus, FaMinus } from 'react-icons/fa';
import PricingCard from '../../components/pricingCard/PricingCard';
// import logo from '../../assets/image/Logo2.png'
import { MdOutlineDone } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import HeroImage from "../../assets/image/HeroImage.png";
import HeroImage2 from "../../assets/image/HeroImage2.png";



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


  return (
    <div className={Styles.landingPageContainer}> 
  <div className={Styles.landingPageHero}>
    <div className={Styles.navbarContainer}>
      <Navbar />
    </div>
    <div className={Styles.heroSection}>
      <div className={Styles.heroContent}>
        
        <h1 className={Styles.heroTitle}>
          Track, analyze, and optimize your trading performance with ai insights.
        </h1>
        
        <div className={Styles.heroTags}>
          <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Pattern Recognition</p>
          <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Ai Insights</p>
          <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Improve Win Rate</p>
        </div>
        
        <div className={Styles.heroCta}>
          <NavLink to={"/register"}><FilledButton text='Start For Free' /></NavLink>
        </div>
        
        {/* Enhanced Hero Image Container */}
        <div className={Styles.heroRectangle}>
          <div className={Styles.heroImageContainer}>
            {/* Desktop Images */}
            <div className={Styles.heroImage}>
              <img 
                src={HeroImage} 
                alt="Trading Dashboard" 
                className={Styles.heroMockup} 
              />
            </div>
            <div className={Styles.heroImageSecondary}>
              <img src={HeroImage} alt="Analytics Dashboard" className={Styles.heroMockupSecondary} />
            </div>
            <div className={Styles.heroImageTertiary}>
              <img src={HeroImage} alt="Performance Metrics" className={Styles.heroMockupTertiary} />
            </div>
            
            {/* Mobile Images */}
            <div className={Styles.mobileHeroImage}>
              <img 
                src={HeroImage2} 
                alt="Trading Dashboard Mobile" 
                className={Styles.heroMockup} 
              />
            </div>
            <div className={Styles.mobileHeroSecondary}>
              <img src={HeroImage2} alt="Analytics Dashboard Mobile" className={Styles.heroMockupSecondary} />
            </div>
            <div className={Styles.mobileHeroTertiary}>
              <img src={HeroImage2} alt="Performance Metrics Mobile" className={Styles.heroMockupTertiary} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


      {/* Brokerage Integration Section */}
<section className={Styles.brokerageSection}>
  <div className={Styles.sectionContainer}>
    <div className={Styles.brokarageSectionHeading}>
      <p>Connect seamlessly with your preferred trading platform</p>
    </div>
    
    <div className={Styles.brokerMarquee}>
      <div className={Styles.marqueeContent}>
        {/* First set of logos */}
        <div className={Styles.brokerItem}>
          <img src={zerodhaLogo} alt="Zerodha" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={angelOneLogo} alt="Angel One" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={upstoxLogo} alt="Upstox" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={fivePaisaLogo} alt="5paisa" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={growwLogo} alt="Groww" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={dhanLogo} alt="Dhan" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={aliceblue} alt="Alice Blue" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={sahi} alt="Sahi" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={trackk} alt="Trackk" className={Styles.brokerLogo} />
        </div>
        
        {/* Duplicated set for seamless looping */}
        <div className={Styles.brokerItem}>
          <img src={zerodhaLogo} alt="Zerodha" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={angelOneLogo} alt="Angel One" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={upstoxLogo} alt="Upstox" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={fivePaisaLogo} alt="5paisa" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={growwLogo} alt="Groww" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={dhanLogo} alt="Dhan" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={aliceblue} alt="Alice Blue" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={sahi} alt="Sahi" className={Styles.brokerLogo} />
        </div>
        <div className={Styles.brokerItem}>
          <img src={trackk} alt="Trackk" className={Styles.brokerLogo} />
        </div>
      </div>
    </div>
    
    <div className={Styles.comingSoonContainer}>
      <div className={Styles.comingSoonBadge}>
        <p>Coming Soon</p>
        <p>(Early access to premium users)</p>
      </div>
      </div>
  </div>
</section>



      {/* AI Powered Section */}
      <section className={Styles.aiPoweredSection}>
        <div className={Styles.sectionContainer}>
            <div className={Styles.sectionHeader}>
              <div className={Styles.heroTags}><p className={`${Styles.tags} ${Styles.aiTag}`}><span><HiSparkles/></span>Ai Powered</p></div>
              <h2>AI-Powered Trading Insights</h2>
            </div>
            <div className={Styles.aiSection}>
              <div className={Styles.rectangle}></div>
              <div className={Styles.aiImageContainer}>
                <img src={aiPoweredImage} alt="Ai Insights Image" className={Styles.aiImage} />
              </div>
            </div>
        </div>
      </section>

      <section className={Styles.highlights}>
        <div className={Styles.highlightSection}>
          <h2>Transform Your Trading Performance with Advanced Analytics and Professional Grade Tools</h2>
        </div>
    </section>


      {/* Features Section - Replacing How It Works */}
<section className={Styles.featuresSection}>
  <div className={Styles.featuresTag}>
    <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Everything You Need to Journal Like a Pro</p>
  </div>
  
  <div className={Styles.featuresHeader}>
    <h2>Comprehensive trading journal features designed to help you analyze your performance, identify improvements, and become a consistently profitable trader.</h2>
  </div>

  <div className={Styles.featuresGrid}>
    {/* Feature 1: Multi-Asset Support */}
    <div className={Styles.featureCard}>
      <div className={Styles.featureIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L14.55 13.47L16.18 20L12 16.77L7.82 20L9.45 13.47L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      </div>
      <h3>Multi-Asset Support</h3>
      <p>Track trades across stocks, futures, crypto, and forex markets all in one place.</p>
    </div>

    {/* Feature 2: Performance Analytics */}
    <div className={Styles.featureCard}>
      <div className={Styles.featureIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 22H21M3 6H21M3 2H21V22H3V2ZM7 10H17V18H7V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3>Performance Analytics</h3>
      <p>Deep insights into your trading performance with detailed P&L analysis and metrics.</p>
    </div>

    {/* Feature 3: Risk Management */}
    <div className={Styles.featureCard}>
      <div className={Styles.featureIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3>Risk Management</h3>
      <p>Monitor your risk exposure and track key risk metrics to improve your trading discipline.</p>
    </div>

    {/* Feature 4: Pattern Recognition */}
    <div className={Styles.featureCard}>
      <div className={Styles.featureIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3>Pattern Recognition</h3>
      <p>AI analyzes your trading patterns to identify winning and losing strategies automatically.</p>
    </div>

    {/* Feature 5: Risk Assessment */}
    <div className={Styles.featureCard}>
  <div className={Styles.featureIcon}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
  <h3>Risk Assessment</h3>
  <p>Get AI-powered risk analysis and position sizing recommendations for each trade.</p>
</div>

    {/* Feature 6: Market Sentiment */}
    <div className={Styles.featureCard}>
      <div className={Styles.featureIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3>Market Sentiment</h3>
      <p>Real-time AI analysis of market sentiment and news impact on your positions.</p>
    </div>
  </div>
</section>



      <div id='pricing' className={Styles.pricingContainer}>
        <PricingCard />
      </div>


      {/* FAQ Section */}
      <section className={Styles.faqSection}>
        <div className={Styles.sectionContainer}>
          <div className={Styles.faqHeader}>
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

      {/* CTA Card Section */}
<section className={Styles.ctaCardSection}>
  <div className={Styles.sectionContainer}>
    <div className={Styles.ctaCard}>
      <h2>Ready to transform your trading?</h2>
      <p>Get started with TradeJournalAI's powerful analytics to improve your trading performance</p>
      <NavLink to={"/register"}>
        <FilledButton text='Start Journaling' />
      </NavLink>
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