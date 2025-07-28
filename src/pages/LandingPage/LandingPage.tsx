import { FilledButton } from '../../components/Button/Button'
import Navbar from '../../components/Navbar/Navbar'
import TopBanner from '../../components/TopBanner/TopBanner'
import Styles from './LandingPage.module.css'
import { IoFolderOpenOutline } from "react-icons/io5";
import { TbPlant } from "react-icons/tb";
import HeroSectionImage from '../../assets/image/heroSectionImage.png'


const LandingPage = () => {
  return (
    <div className={Styles.landingPageContainer}>
      <div className={Styles.landingPageHero}>
        <div className={Styles.topBannerContainer}>
          <TopBanner/>
        </div>
        <div className={Styles.navbarContainer}>
          <Navbar/>
        </div>
        <div className={Styles.heroSection}>
          <div className={Styles.heroSectionLeft}>
            <div className={Styles.mainHeading}>
              <p className={Styles.topHeading}>Money works <br />better here.</p>
              <div className={Styles.middleHeading}>
                <div className={Styles.middleHeadingLeft}>
                  <div className={Styles.middleHeadingIcon}><IoFolderOpenOutline className={Styles.folderIcon}/></div>
                  <div className={Styles.middleHeadingText}>
                    <p className={Styles.middleSubHeading}>Lorem, ipsum dolor.</p>
                    <p className={Styles.middleSubText}>Lorem ipsum dolor sit amet consectetur.</p>
                  </div>
                </div>
                <div className={Styles.middleHeadingRight}>
                  <div className={Styles.middleHeadingIcon}><TbPlant className={Styles.folderIcon}/></div>
                  <p className={Styles.middleSubHeading}>Lorem ipsum dolor <br /> sit amet consectetur adipisicing.</p>
                </div>
              </div>
              <div className={Styles.ctaContainer}>
                <div className={Styles.ctaButton}><FilledButton text='Get started'/></div>
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
          </div>
          <div className={Styles.heroSectionRight}>
            <div className={Styles.heroSectionImageContainer}><img src={HeroSectionImage} alt="HeroSectionImage" className={Styles.heroSectionImage}/></div>
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
    </div>
  )
}

export default LandingPage
