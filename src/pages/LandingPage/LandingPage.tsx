import Navbar from '../../components/Navbar/Navbar'
import TopBanner from '../../components/TopBanner/TopBanner'
import Styles from './LandingPage.module.css'
const LandingPage = () => {
  return (
    <div className={Styles.landingPageContainer}>
      <div className={Styles.topBannerContainer}>
        <TopBanner/>
      </div>
      <div className={Styles.navbarContainer}>
        <Navbar/>
      </div>
    </div>
  )
}

export default LandingPage
