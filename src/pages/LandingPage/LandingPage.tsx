import { FilledButton } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import TopBanner from '../../components/TopBanner/TopBanner';
import Styles from './LandingPage.module.css';
import { IoFolderOpenOutline } from 'react-icons/io5';
import { TbPlant } from 'react-icons/tb';
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

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isPastInformation, setIsPastInformation] = useState<boolean>(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 883);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  // const gradientColors: string[] = [
  //   "linear-gradient(#d9edca, #fff3d6)",
  //   "linear-gradient(#f7eae4, #DBDEF0)",
  //   "linear-gradient(#c3cdf4, #fed0b9)",
  //   "linear-gradient(#230b5b, #4840ba)"
  // ];

const gradientColors: string[] = [
    "linear-gradient(#C8E1FF, #E8F4FF)",   // Light pure blue to very light blue
    "linear-gradient(#DDEEFF, #C2DDFF)",   // Soft blue to light blue with more saturation
    "linear-gradient(#85A9DD, #B8CEFF)",   // Medium blue to light blue (more vibrant)
    "linear-gradient(#0A3D7A, #1255CC)"    // Dark blue to brighter primary blue
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
        <div className={Styles.heroSection}>
          <div className={Styles.heroSectionLeft}>
            <div className={Styles.mainHeading}>
              {/* Main Headline (Unchanged as requested) */}
              <p className={Styles.topHeading}>Money works <br />better here.</p>
              <div className={Styles.middleHeading}>
                {/* Feature 1 */}
                <div className={Styles.middleHeadingLeft}>
                  <div className={Styles.middleHeadingIcon}><IoFolderOpenOutline className={Styles.folderIcon} /></div>
                  <div className={Styles.middleHeadingText}>
                    <p className={Styles.middleSubHeading}>Log every detail, effortlessly.</p>
                    <p className={Styles.middleSubText}>Capture your setups, emotions, and outcomes in seconds.</p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className={Styles.middleHeadingRight}>
                  <div className={Styles.middleHeadingIcon}><TbPlant className={Styles.folderIcon} /></div>
                  <p className={Styles.middleSubHeading}>Discover your winning patterns.</p>
                </div>
              </div>
              {/* Call to Action */}
              <div className={Styles.ctaContainer}>
                <div className={Styles.ctaButton}><FilledButton text='Start free' /></div>
                {/* Updated CTA Text */}
                <p className={Styles.ctaText}>*It will be free for first 24 hours.</p>
              </div>
            </div>
            {/* Secondary Benefits */}
            <div className={Styles.headingBottom}>
              <div className={Styles.bottomLeft}>
                {/* Updated Heading for AI Feature */}
                <p className={Styles.bottomHeading}>AI Insights</p>
                <p className={Styles.bottomSubHeading}>Receive actionable, AI-powered feedback on every trade.</p>
              </div>
              <div className={Styles.bottomRight}>
                {/* Updated Heading */}
                <p className={Styles.bottomHeading}>Psychology</p>
                <p className={Styles.bottomSubHeading}>Track your emotional state to conquer fear and greed.</p>
              </div>
            </div>
            {/* Social Proof / Key Stats */}
            <div className={Styles.stats}>
              <div className={Styles.rightBottom}>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>30+</p>
                  <p className={Styles.bottomSubHeading}>Detailed Data Points</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>9/10</p>
                  <p className={Styles.bottomSubHeading}>Elite Trader Tool</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>5</p>
                  <p className={Styles.bottomSubHeading}>Emotional Metrics</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>100%</p>
                  <p className={Styles.bottomSubHeading}>Secure & Private</p>
                </div>
              </div>
            </div>

          </div>
          <div className={Styles.heroSectionRight}>
            <div className={Styles.heroSectionImageContainer}><img src={HeroSectionImage} alt="Trade Journal Dashboard" className={Styles.heroSectionImage} /></div>
            {/* Mobile-only Stats */}
            <div className={Styles.rightBottom}>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>30+</p>
                  <p className={Styles.bottomSubHeading}>Detailed Data Points</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>9/10</p>
                  <p className={Styles.bottomSubHeading}>Elite Trader Tool</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>5</p>
                  <p className={Styles.bottomSubHeading}>Emotional Metrics</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>100%</p>
                  <p className={Styles.bottomSubHeading}>Secure & Private</p>
                </div>
              </div>
          </div>
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
        {/* Section 0 */}
        <div
          id='section-0'
          ref={(el) => registerSection(el, 0)}
          className={`${Styles.infoContainer} ${Styles.section0}`}
        >
          <InfoContainer
            tags={["Lorem ipsum dolor"]}
            heading="Lorem ipsum dolor sit amet."
            subHeading="Lorem, ipsum dolor."
            infoPara="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure neque odio optio illo voluptatem repellendus, magni molestias culpa alias sit dolore vel harum assumenda velit nihil quod a ab minima! Molestias, laborum."
            points={[
              { icon: <IoCloseCircle />, text: "Lorem, ipsum dolor." },
              { icon: <FaArrowRightArrowLeft />, text: "Lorem ipsum dolor sit amet." },
              { icon: <TiTick />, text: "Lorem ipsum dolor sit amet consectetur." },
              { icon: <GoHomeFill />, text: "Lorem ipsum dolor sit amet consectetur." }
            ]}
            primaryButtonText="Start saving with $1"
            secondaryButtonText="Learn More"
            buttonSmallText="Lorem ipsum dolor sit amet consectetur adipisicing."
          />
        </div>
        <div className={`${Styles.informationImageContainer} ${Styles.image0}`} style={{ background: gradientColors[0] }} />

        {/* Section 1 */}
        <div
          id='section-1'
          ref={(el) => registerSection(el, 1)}
          className={`${Styles.infoContainer} ${Styles.section1}`}
        >
          <InfoContainer
            tags={["Lorem Ipsum dolor", "Lorem Ipsum"]}
            heading="Lorem ipsum dolor sit amet."
            subHeading="Lorem, ipsum dolor."
            infoPara="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure neque odio optio illo voluptatem repellendus, magni molestias culpa alias sit dolore vel harum assumenda velit nihil quod a ab minima! Molestias, laborum."
            points={[
              { icon: <IoCloseCircle />, text: "Lorem, ipsum dolor." },
              { icon: <FaArrowRightArrowLeft />, text: "Lorem ipsum dolor sit amet." },
              { icon: <TiTick />, text: "Lorem ipsum dolor sit amet consectetur." },
              { icon: <GoHomeFill />, text: "Lorem ipsum dolor sit amet consectetur." }
            ]}
            primaryButtonText="Start saving with $1"
            secondaryButtonText="Learn More"
            buttonSmallText="Lorem ipsum dolor sit amet consectetur adipisicing."
          />
        </div>
        <div className={`${Styles.informationImageContainer} ${Styles.image1}`} style={{ background: gradientColors[1] }} />

        {/* Section 2 */}
        <div
          id='section-2'
          ref={(el) => registerSection(el, 2)}
          className={`${Styles.infoContainer} ${Styles.section2}`}
        >
          <InfoContainer
            tags={["Lorem Ipsum dolor", "Lorem"]}
            heading="Lorem ipsum dolor sit amet."
            subHeading="Lorem, ipsum dolor."
            infoPara="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure neque odio optio illo voluptatem repellendus, magni molestias culpa alias sit dolore vel harum assumenda velit nihil quod a ab minima! Molestias, laborum."
            points={[
              { icon: <IoCloseCircle />, text: "Lorem, ipsum dolor." },
              { icon: <FaArrowRightArrowLeft />, text: "Lorem ipsum dolor sit amet." },
              { icon: <TiTick />, text: "Lorem ipsum dolor sit amet consectetur." },
              { icon: <GoHomeFill />, text: "Lorem ipsum dolor sit amet consectetur." }
            ]}
            primaryButtonText="Start saving with $1"
            secondaryButtonText="Learn More"
            buttonSmallText="Lorem ipsum dolor sit amet consectetur adipisicing."
          />
        </div>
        <div className={`${Styles.informationImageContainer} ${Styles.image2}`} style={{ background: gradientColors[2] }} />

        {/* Section 3 */}
        <div
          id='section-3'
          ref={(el) => registerSection(el, 3)}
          className={`${Styles.infoContainer} ${Styles.section3}`}
        >
          <InfoContainer
            tags={["Lorem Ipsum", "Lorem Ipsum dolor"]}
            heading="Lorem ipsum dolor sit amet."
            subHeading="Lorem, ipsum dolor."
            infoPara="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure neque odio optio illo voluptatem repellendus, magni molestias culpa alias sit dolore vel harum assumenda velit nihil quod a ab minima! Molestias, laborum."
            points={[
              { icon: <IoCloseCircle />, text: "Lorem, ipsum dolor." },
              { icon: <FaArrowRightArrowLeft />, text: "Lorem ipsum dolor sit amet." },
              { icon: <TiTick />, text: "Lorem ipsum dolor sit amet consectetur." },
              { icon: <GoHomeFill />, text: "Lorem ipsum dolor sit amet consectetur." }
            ]}
            primaryButtonText="Start saving with $1"
            secondaryButtonText="Learn More"
            buttonSmallText="Lorem ipsum dolor sit amet consectetur adipisicing."
          />
        </div>
        <div className={`${Styles.informationImageContainer} ${Styles.image3}`} style={{ background: gradientColors[3] }} />
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