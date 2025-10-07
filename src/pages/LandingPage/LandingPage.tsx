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
import HowItWorksTrades from "../../assets/image/HowItWorksTrades.png";
import HowItWorksCalendar from "../../assets/image/HowItWorksCalendar.png";
import HowItWorksPsycology from "../../assets/image/HowItWorksPsycology.png";
import HeroImage from "../../assets/image/HeroImage.png";



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
        Track, analyze, and optimize your trading performance with precision.
      </h1>
      
      <div className={Styles.heroTags}>
        <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Pattern Recognition</p>
        <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Ai Insights</p>
        <p className={Styles.tags}><span><MdOutlineDone className={Styles.tagIcons}/></span>Improve Win Rate</p>
      </div>
      
      <div className={Styles.heroCta}>
        <NavLink to={"/register"}><FilledButton text='Start For Free' /></NavLink>
      </div>
      
      <div className={Styles.heroRectangle}>
        <div className={Styles.heroImageContainer}>
          <div className={Styles.heroImage}>
            <img src={HeroImage} alt="Trading Dashboard" className={Styles.heroMockup} />
          </div>
          <div className={Styles.heroImageSecondary}>
            <img src={HeroImage} alt="Analytics Dashboard" className={Styles.heroMockupSecondary} />
          </div>
          <div className={Styles.heroImageTertiary}>
            <img src={HeroImage} alt="Performance Metrics" className={Styles.heroMockupTertiary} />
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


      {/* How It Works Section */}
      <section className={Styles.howItWorksSection}>
        <div className={Styles.howItWorksTag}>
          <p className={Styles.tags}>Product Highlights</p>
        </div>
        <div className={Styles.howItWorksCards}>
          <div className={`${Styles.howItWorksCard} ${Styles.card1}`}>
            <div className={Styles.text}>
              <p className={Styles.howItWorksCardHeading}>Comprehensive Trade Management and Detailed Portfolio Overview in One Place</p>
              <p className={Styles.howItWorksCardSubHeading}>Enter your trade details effortlessly and watch them transform into organized, professional table formats. Track every position, analyze entry and exit points, monitor profit and loss in real-time, and access complete trade history with advanced filtering options for better decision making.</p>
              <NavLink to={"/login"}><p className={Styles.howItWorksCardCta}>Learn More</p></NavLink>
            </div>
            <div className={Styles.image}>
              <img src={HowItWorksTrades} alt="All Trades Management Dashboard" />
            </div>
          </div>
          
          <div className={`${Styles.howItWorksCard} ${Styles.card2}`}>
            <div className={Styles.image}>
              <img src={HowItWorksCalendar} alt="Monthly Trading Calendar View" />
            </div>            
            <div className={Styles.text}>
              <p className={Styles.howItWorksCardHeading}>Monthly Trading Performance Calendar with Detailed Analytics and Progress Tracking</p>
              <p className={Styles.howItWorksCardSubHeading}>Visualize your trading journey through our intuitive monthly calendar view. Monitor daily performance patterns, identify profitable trading days, track consistency metrics, and discover seasonal trends in your trading behavior to optimize future strategies and maximize returns.</p>
              <NavLink to={"/login"}><p className={Styles.howItWorksCardCta}>Learn More</p></NavLink>
            </div>
          </div>
          
          <div className={`${Styles.howItWorksCard} ${Styles.card3}`}>
            <div className={Styles.text}>
              <p className={Styles.howItWorksCardHeading}>Advanced Trading Psychology Analysis and Mindset Optimization for Better Results</p>
              <p className={Styles.howItWorksCardSubHeading}>Understand your psychological patterns and emotional triggers during trades. Analyze decision-making processes, identify behavioral biases, track emotional states during winning and losing streaks, and develop mental discipline for consistent trading performance and improved market psychology.</p>
              <NavLink to={"/login"}><p className={Styles.howItWorksCardCta}>Learn More</p></NavLink>
            </div>
            <div className={Styles.image}>
              <img src={HowItWorksPsycology} alt="Trading Psychology Analytics Dashboard" />
            </div>          
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

      <div className={Styles.footerContainer}>
        <Footer /> 
      </div>
    </div>
  );
};

export default LandingPage;