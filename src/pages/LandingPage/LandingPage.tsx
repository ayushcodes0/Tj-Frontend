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

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
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
    "linear-gradient(#d9edca, #fff3d6)",
    "linear-gradient(#f7eae4, #DBDEF0)",
    "linear-gradient(#c3cdf4, #fed0b9)",
    "linear-gradient(#230b5b, #4840ba)"
  ];

  const menuItems = [
    { top: '"Lorem", ipsum.', bottom: 'Lorem, ipsum dolor1.' },
    { top: '"Lorem", ipsum.', bottom: 'Lorem, ipsum dolor2.' },
    { top: '"Lorem", ipsum.', bottom: 'Lorem, ipsum dolor3.' },
    { top: '"Lorem", ipsum.', bottom: 'Lorem, ipsum dolor4.' }
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
              <p className={Styles.topHeading}>Lorem Ipsum <br />Dolor Sit.</p>
              <div className={Styles.middleHeading}>
                <div className={Styles.middleHeadingLeft}>
                  <div className={Styles.middleHeadingIcon}><IoFolderOpenOutline className={Styles.folderIcon} /></div>
                  <div className={Styles.middleHeadingText}>
                    <p className={Styles.middleSubHeading}>Lorem, ipsum dolor.</p>
                    <p className={Styles.middleSubText}>Lorem ipsum dolor sit amet consectetur.</p>
                  </div>
                </div>
                <div className={Styles.middleHeadingRight}>
                  <div className={Styles.middleHeadingIcon}><TbPlant className={Styles.folderIcon} /></div>
                  <p className={Styles.middleSubHeading}>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                </div>
              </div>
              <div className={Styles.ctaContainer}>
                <div className={Styles.ctaButton}><FilledButton text='Get started' /></div>
                <p className={Styles.ctaText}>*Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <div className={Styles.headingBottom}>
              <div className={Styles.bottomLeft}>
                <p className={Styles.bottomHeading}>Lorem.</p>
                <p className={Styles.bottomSubHeading}>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
              </div>
              <div className={Styles.bottomRight}>
                <p className={Styles.bottomHeading}>Lorem.</p>
                <p className={Styles.bottomSubHeading}>Lorem ipsum dolor sit amet consectetur <br /> adipisicing elit. Unde reiciendis magnam similique!</p>
              </div>
            </div>
            <div className={Styles.stats}>
              <div className={Styles.rightBottom}>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>1M+</p>
                  <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>Lorem.</p>
                  <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>Lorem.</p>
                  <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
                </div>
                <div className={Styles.bottomLeft}>
                  <p className={Styles.bottomHeading}>Lorem.</p>
                  <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.heroSectionRight}>
            <div className={Styles.heroSectionImageContainer}><img src={HeroSectionImage} alt="HeroSectionImage" className={Styles.heroSectionImage} /></div>
            <div className={Styles.rightBottom}>
              <div className={Styles.bottomLeft}>
                <p className={Styles.bottomHeading}>1M+</p>
                <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
              </div>
              <div className={Styles.bottomLeft}>
                <p className={Styles.bottomHeading}>Lorem.</p>
                <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
              </div>
              <div className={Styles.bottomLeft}>
                <p className={Styles.bottomHeading}>Lorem.</p>
                <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
              </div>
              <div className={Styles.bottomLeft}>
                <p className={Styles.bottomHeading}>Lorem.</p>
                <p className={Styles.bottomSubHeading}>Lorem, ipsum.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={Styles.infoSectionTop}>
        {isMobileView ? (
          <>
            <div 
              className={`${Styles.infoMenu} ${activeSection === 0 ? Styles.activeMenu : ''} ${Styles.mobileDrawerHeader}`}
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
      <div className={Styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;