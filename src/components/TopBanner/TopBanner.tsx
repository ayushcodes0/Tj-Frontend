import Styles from './TopBanner.module.css'
import dotBackground from '../../assets/image/dots-background1.png'
const TopBanner = () => {
  return (
    <div className={Styles.topBanner}>
      <p className={Styles.heading}>Lorem</p>
      <p className={Styles.subHeading}>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      <img className={Styles.dotImage} src={dotBackground} alt="" />
      <img className={Styles.dotImage2} src={dotBackground} alt="" />
    </div>
  )
}

export default TopBanner
