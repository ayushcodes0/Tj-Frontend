import { FilledButton } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import TopBanner from '../../components/TopBanner/TopBanner';
import Styles from './LandingPage.module.css';
// import { IoFolderOpenOutline } from 'react-icons/io5';
// import { TbPlant } from 'react-icons/tb';
import HeroSectionImage from '../../assets/image/heroSectionImage.png';
import { IoCloseCircle } from 'react-icons/io5';
import { TiTick } from 'react-icons/ti';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { GoHomeFill } from 'react-icons/go';
import InfoContainer from '../../components/InfoContainer/InfoContainer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Footer from '../../components/Footer/Footer';
import Pricing from '../../components/Pricing/Pricing';
import { FaBrain } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Variants } from "framer-motion";
import { IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { NavLink } from 'react-router-dom';
import dashboardImage from "../../assets/image/dashboardImage.png";
import aiInsightsImage from "../../assets/image/aiInsights.png"
import newTradeImage from "../../assets/image/newTradeImage.png"
import performanceImage from "../../assets/image/performance.png"

// Animation variants
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

const fadeUpItemFast: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.4
    }
  }
};

// const fadeInUp: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       ease: [0.16, 0.77, 0.47, 0.97]
//     }
//   }
// };

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

const imageContainerVariants: Variants = {
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

const imageRotate: Variants = {
  hidden: { opacity: 0, rotate: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.8,
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isPastInformation, setIsPastInformation] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');
  const lastScrollYRef = useRef<number>(0);
  const controls = useAnimation();
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

  useEffect(() => {
    const handleScroll = () => {
      const informationContainer = document.querySelector(`.${Styles.information}`);
      if (!informationContainer) return;
      
      const lastChild = informationContainer.lastElementChild;
      if (!lastChild) return;
      
      const containerRect = informationContainer.getBoundingClientRect();
      const lastChildRect = lastChild.getBoundingClientRect();
      
      const trueEnd = Math.max(
        containerRect.bottom + window.pageYOffset,
        lastChildRect.bottom + window.pageYOffset
      );
      
      const currentPosition = window.pageYOffset + window.innerHeight - 200;
      setIsPastInformation(currentPosition > trueEnd);
    };

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  const registerSection = useCallback((element: HTMLElement | null, index: number) => {
    sectionsRef.current[index] = element;
  }, []);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 100) return;
    lastScrollTimeRef.current = now;

    const scrollY = window.pageYOffset;
    const direction = scrollY > (lastScrollYRef.current ?? 0) ? 'down' : 'up';
    scrollDirectionRef.current = direction;
    lastScrollYRef.current = scrollY > 0 ? scrollY : 0;

    const viewportHeight = window.innerHeight;
    const scrollPosition = scrollY + viewportHeight / 2;

    let closestSectionIndex = 0;
    let smallestDistance = Infinity;

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;
      const sectionCenter = sectionTop + rect.height / 2;

      const distance = Math.abs(scrollPosition - sectionCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestSectionIndex = index;
      }
    });

    if (activeSection !== closestSectionIndex) {
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setActiveSection(closestSectionIndex);
      }, 50);
    }
  }, [activeSection]);

  useEffect(() => {
    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const handleMenuClick = useCallback((index: number) => {
    if (scrollTimeoutRef.current !== null) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setActiveSection(index);
    const element = sectionsRef.current[index];
    if (element) {
      const stickyHeaderHeight = 89;
      const isMobile = window.innerWidth < 883;
      const additionalOffset = 220;

      const yOffset = isMobile 
        ? -(stickyHeaderHeight + additionalOffset)
        : -stickyHeaderHeight; 

      if (isMobile) {
        const imageContainer = document.querySelector(`.${Styles[`image${index}`]}`) as HTMLElement;
        if (imageContainer) {
          const imageY = imageContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: imageY, behavior: 'smooth' });
        }
      } else {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    if (isMobileView) {
      setIsMobileDrawerOpen(false);
    }
  }, [isMobileView]);

  const toggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(prev => !prev);
  }, []);

  const gradientColors: string[] = [
    "linear-gradient(#C8E1FF, #E8F4FF)",
    "linear-gradient(#DDEEFF, #C2DDFF)",
    "linear-gradient(#85A9DD, #B8CEFF)",
    "linear-gradient(#0A3D7A, #1255CC)"
  ];

  const menuItems = [
    { 
      top: 'Unified Dashboard', 
      bottom: 'See everything now.' 
    },
    { 
      top: 'AI Insights', 
      bottom: 'Discover your edge.' 
    },
    { 
      top: 'Detailed Logging', 
      bottom: 'Capture every detail.' 
    },
    { 
      top: 'Mindful Trading', 
      bottom: 'Master your emotions.' 
    }
  ];

  return (
    <div className={Styles.landingPageContainer}> 
      <div className={Styles.landingPageHero}>
        <div className={Styles.topBannerContainer}>
          <TopBanner />
        </div>
        <div className={Styles.navbarContainer}>
          <Navbar />
        </div>
        <div className={Styles.heroSection} ref={ref}>
          <div className={Styles.heroSectionLeft}>
            <motion.div 
              className={Styles.mainHeading}
              initial="hidden"
              animate={controls}
              variants={containerVariants}
            >
              {/* Main Headline with animation */}
              <motion.h1 
                className={Styles.topHeading}
                variants={fadeUpItem}
                custom={0}
              >
                Money works <br />better here.
              </motion.h1>
              
              <motion.div 
                className={Styles.middleHeading}
                variants={staggerContainer}
              >
                {/* Feature 1 */}
                <motion.div 
                  className={Styles.middleHeadingLeft}
                  variants={fadeUpItem}
                  custom={1}
                >
                  <div className={Styles.middleHeadingIcon}>
                    <IoNewspaperOutline className={Styles.folderIcon} />
                  </div>
                  <div className={Styles.middleHeadingText}>
                    <p className={Styles.middleSubHeading}>Log every detail, effortlessly.</p>
                    <p className={Styles.middleSubText}>Capture your setups, emotions, and outcomes in seconds.</p>
                  </div>
                </motion.div>
                
                {/* Feature 2 */}
                <motion.div 
                  className={Styles.middleHeadingRight}
                  variants={fadeUpItem}
                  custom={1.2}
                >
                  <div className={Styles.middleHeadingIcon}>
                    <HiOutlineTrendingUp className={Styles.folderIcon} />
                  </div>
                  <p className={Styles.middleSubHeading}>Discover your winning patterns.</p>
                </motion.div>
              </motion.div>
              
              {/* Call to Action */}
              <motion.div 
                className={Styles.ctaContainer}
                variants={fadeUpItem}
                custom={1.4}
              >
                <div className={Styles.ctaButton}>
                  <NavLink to={"/register"} ><FilledButton text='Start free' /></NavLink>
                </div>
                <motion.p 
                  className={Styles.ctaText}
                  variants={fadeUpItemFast}
                  custom={1.5}
                >
                  *It will be free for first 24 hours.
                </motion.p>
              </motion.div>
            </motion.div>
            
            {/* Secondary Benefits */}
            <motion.div 
              className={Styles.headingBottom}
              initial="hidden"
              animate={controls}
              variants={staggerContainer}
            >
              <motion.div 
                className={Styles.bottomLeft}
                variants={fadeUpItem}
                custom={1.6}
              >
                <p className={Styles.bottomHeading}>AI Insights</p>
                <p className={Styles.bottomSubHeading}>Receive actionable, AI-powered feedback on every trade.</p>
              </motion.div>
              
              <motion.div 
                className={Styles.bottomRight}
                variants={fadeUpItem}
                custom={1.8}
              >
                <p className={Styles.bottomHeading}>Psychology</p>
                <p className={Styles.bottomSubHeading}>Track your emotional state to conquer fear and greed.</p>
              </motion.div>
            </motion.div>
            
            {/* Social Proof / Key Stats */}
            <motion.div 
              className={Styles.stats}
              initial="hidden"
              animate={controls}
              variants={staggerContainer}
            >
              <motion.div 
                className={Styles.rightBottom}
                variants={fadeUpItem}
                custom={2}
              >
                <motion.div 
                  className={Styles.bottomLeft}
                  variants={fadeUpItemFast}
                  custom={2.1}
                >
                  <p className={Styles.bottomHeading}>30+</p>
                  <p className={Styles.bottomSubHeading}>Detailed Data Points</p>
                </motion.div>
                <motion.div 
                  className={Styles.bottomLeft}
                  variants={fadeUpItemFast}
                  custom={2.2}
                >
                  <p className={Styles.bottomHeading}>9/10</p>
                  <p className={Styles.bottomSubHeading}>Elite Trader Tool</p>
                </motion.div>
                <motion.div 
                  className={Styles.bottomLeft}
                  variants={fadeUpItemFast}
                  custom={2.3}
                >
                  <p className={Styles.bottomHeading}>5</p>
                  <p className={Styles.bottomSubHeading}>Emotional Metrics</p>
                </motion.div>
                <motion.div 
                  className={Styles.bottomLeft}
                  variants={fadeUpItemFast}
                  custom={2.4}
                >
                  <p className={Styles.bottomHeading}>100%</p>
                  <p className={Styles.bottomSubHeading}>Secure & Private</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className={Styles.heroSectionRight}
            initial="hidden"
            animate={controls}
            variants={{}}
          >
            <motion.div 
              className={Styles.heroSectionImageContainer}
              variants={imageRotate}
            >
              <img 
                src={HeroSectionImage} 
                alt="Trade Journal Dashboard" 
                className={Styles.heroSectionImage}
              />
            </motion.div>
            
            {/* Mobile-only Stats */}
            <motion.div 
              className={Styles.rightBottom}
              initial="hidden"
              animate={controls}
              variants={staggerContainer}
            >
              <motion.div 
                className={Styles.bottomLeft}
                variants={fadeUpItemFast}
                custom={0.5}
              >
                <p className={Styles.bottomHeading}>30+</p>
                <p className={Styles.bottomSubHeading}>Detailed Data Points</p>
              </motion.div>
              <motion.div 
                className={Styles.bottomLeft}
                variants={fadeUpItemFast}
                custom={0.6}
              >
                <p className={Styles.bottomHeading}>9/10</p>
                <p className={Styles.bottomSubHeading}>Elite Trader Tool</p>
              </motion.div>
              <motion.div 
                className={Styles.bottomLeft}
                variants={fadeUpItemFast}
                custom={0.7}
              >
                <p className={Styles.bottomHeading}>5</p>
                <p className={Styles.bottomSubHeading}>Emotional Metrics</p>
              </motion.div>
              <motion.div 
                className={Styles.bottomLeft}
                variants={fadeUpItemFast}
                custom={0.8}
              >
                <p className={Styles.bottomHeading}>100%</p>
                <p className={Styles.bottomSubHeading}>Secure & Private</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className={`${Styles.infoSectionTop} ${!isPastInformation ? Styles.stickyHeader : ''}`}>
        {isMobileView ? (
          <>
            <div 
              className={`${Styles.infoMenu} ${activeSection === 0 ? Styles.activeMenu : ''} ${Styles.mobileDrawerHeader} ${!isPastInformation ? Styles.stickyHeader : ''}`}
              onClick={() => activeSection === 0 ? toggleMobileDrawer() : handleMenuClick(0)}
              style={activeSection === 0 ? {
                background: gradientColors[0],
                color: 'inherit'
              } : undefined}
            >
              <div className={Styles.mobileDrawerHeaderContent}>
                <div>
                  <p className={Styles.infoMenuTop}>{menuItems[activeSection].top}</p>
                  <p className={Styles.infoMenuBottom}>{menuItems[activeSection].bottom}</p>
                </div>
                {isMobileDrawerOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            <div className={`${Styles.mobileDrawerContent} ${isMobileDrawerOpen ? Styles.drawerOpen : ''}`}>
              {menuItems.map((item, index) => (
                index !== activeSection && (
                  <div
                    key={index}
                    className={`${Styles.infoMenu} ${activeSection === index ? Styles.activeMenu : ''}`}
                    onClick={() => handleMenuClick(index)}
                    style={activeSection === index ? {
                      background: gradientColors[index],
                      color: index === 3 ? 'white' : 'inherit'
                    } : undefined}
                  >
                    <div className={Styles.mobileDrawerHeaderContent}>
                      <div>
                        <p className={Styles.infoMenuTop}>{item.top}</p>
                        <p className={Styles.infoMenuBottom}>{item.bottom}</p>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        ) : (
          menuItems.map((item, index) => (
            <div
              key={index}
              className={`${Styles.infoMenu} ${activeSection === index ? Styles.activeMenu : ''}`}
              onClick={() => handleMenuClick(index)}
              style={activeSection === index ? {
                background: gradientColors[index],
                color: index === 3 ? 'white' : 'inherit'
              } : undefined}
            >
              <p className={Styles.infoMenuTop}>{item.top}</p>
              <p className={Styles.infoMenuBottom}>{item.bottom}</p>
            </div>
          ))
        )}
      </div>

      <div className={Styles.information}>
      {/* Section 0: Unified Dashboard */}
      <motion.div
        id='section-0'
        ref={(el) => registerSection(el, 0)}
        className={`${Styles.infoContainer} ${Styles.section0}`}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <InfoContainer
          tags={["Analytics", "Performance", "Overview"]}
          heading="Your Trading Dashboard."
          subHeading="See what matters."
          infoPara="Our Unified Dashboard brings all your critical trading data into one clear, intuitive view. Track your progress, understand your habits, and make informed decisions without the clutter. It's your entire trading world, at a glance."
          points={[
            { icon: <TiTick />, text: "Visualize your equity curve and net profitability." },
            { icon: <TiTick />, text: "Monitor your win rate and average risk-to-reward ratio." },
            { icon: <TiTick />, text: "Filter performance by strategy, symbol, or timeframe." },
            { icon: <TiTick />, text: "See your trading activity on a calendar heat-map." }
          ]}
          primaryButtonText="Start Analyzing for Free"
          secondaryButtonText="Explore Features"
          buttonSmallText="Free 24-hour trial. No credit card required."
        />
      </motion.div>
      <motion.div 
        className={`${Styles.informationImageContainer} ${Styles.image0}`} 
        style={{ background: gradientColors[0] }}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={imageContainerVariants}
      >
        <img src={dashboardImage} alt="Unified Dashboard Image" className={`${Styles.informationImage} ${Styles.dashboardImage}`}/>
      </motion.div>

      {/* Section 1: AI Insights */}
      <motion.div
        id='section-1'
        ref={(el) => registerSection(el, 1)}
        className={`${Styles.infoContainer} ${Styles.section1}`}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <InfoContainer
          tags={["Artificial Intelligence", "Coaching", "Optimization"]}
          heading="Get Actionable AI Insights."
          subHeading="Find your edge."
          infoPara="Stop guessing what works. Our intelligent algorithms sift through your trading data to uncover your most profitable patterns, identify costly mistakes, and provide personalized feedback to help you improve faster."
          points={[
            { icon: <TiTick />, text: "Identifies your best-performing setups and strategies." },
            { icon: <FaBrain/>, text: "Connects emotional states to trading outcomes." },
            { icon: <IoCloseCircle />, text: "Pinpoints common mistakes, like holding losers too long." },
            { icon: <TiTick />, text: "Provides concrete suggestions for optimizing your system." }
          ]}
          primaryButtonText="Unlock Your AI Edge" 
          secondaryButtonText="How It Works"
          buttonSmallText="Available on all plans during your free trial."
        />
      </motion.div>
      <motion.div 
        className={`${Styles.informationImageContainer} ${Styles.image1}`} 
        style={{ background: gradientColors[1] }}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={imageContainerVariants}
      >
        <img src={aiInsightsImage} alt="Ai Insights Image" className={`${Styles.informationImage} ${Styles.aiInsightsImage}`}/>
      </motion.div>

      {/* Section 2: Detailed Logging */}
      <motion.div
        id='section-2'
        ref={(el) => registerSection(el, 2)}
        className={`${Styles.infoContainer} ${Styles.section2}`}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <InfoContainer
          tags={["Effortless", "Detailed", "Secure"]}
          heading="Log Every Trade in Seconds."
          subHeading="Capture every detail."
          infoPara="A journal is only as good as the data you put in. We make it incredibly fast and easy to log every detail, from entry and exit prices to your psychological state and chart screenshots, so you never lose valuable data."
          points={[
            { icon: <FaArrowRightArrowLeft />, text: "Log entry, exit, stop-loss, and multiple targets." },
            { icon: <GoHomeFill />, text: "Attach unlimited chart screenshots to each trade." },
            { icon: <TiTick />, text: "Use custom tags to categorize your unique strategies." },
            { icon: <TiTick />, text: "Record your confidence and emotions for every setup." }
          ]}
          primaryButtonText="Start Journaling Now"
          secondaryButtonText="View Example"
          buttonSmallText="Fast, easy, and secure on all your devices."
        />
      </motion.div>
      <motion.div 
        className={`${Styles.informationImageContainer} ${Styles.image2}`} 
        style={{ background: gradientColors[2] }}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={imageContainerVariants}
      >
        <img src={newTradeImage} alt="Log Trade Image" className={`${Styles.informationImage} ${Styles.newTradeImage}`}/>
      </motion.div>

      {/* Section 3: Mindful Trading */}
      <motion.div
        id='section-3'
        ref={(el) => registerSection(el, 3)}
        className={`${Styles.infoContainer} ${Styles.section3}`}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <InfoContainer
          tags={["Psychology", "Mindset", "Discipline"]}
          heading="Master Your Trading Mindset."
          subHeading="Master your mindset."
          infoPara="Profitability isn't just about strategy; it's about mindset. Our journal is the first to put psychology front and center, helping you track your emotional patterns, build discipline, and trade with unshakeable confidence."
          points={[
            { icon: <TiTick />, text: "Rate your confidence to spot over- and under-confidence." },
            { icon: <IoCloseCircle />, text: "Tag emotional mistakes like FOMO, greed, or revenge trading." },
            { icon: <FaArrowRightArrowLeft />, text: "Compare performance between different emotional states." },
            { icon: <TiTick />, text: "Develop the discipline of a professional trader." }
          ]}
          primaryButtonText="Master Your Mindset"
          secondaryButtonText="Learn More"
          buttonSmallText="Start your free 24-hour trial today."
        />
      </motion.div>
      <motion.div 
        className={`${Styles.informationImageContainer} ${Styles.image3}`} 
        style={{ background: gradientColors[3] }}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={imageContainerVariants}
      >
        <img src={performanceImage} alt="Performance Image" className={`${Styles.informationImage} ${Styles.performanceImage}`}/>
      </motion.div>
    </div>

      <div className={Styles.pricingContainer}>
        <Pricing/>
      </div>
      <div className={Styles.footerContainer}>
        <Footer /> 
      </div>
    </div>
  );
};

export default LandingPage;