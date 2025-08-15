import Styles from './TopBanner.module.css'
import dotBackground from '../../assets/image/dots-background1.png'

const TopBanner = () => {
  return (
    <div className={Styles.topBanner}>
      <p className={Styles.heading}>AI Insights</p>
      <p className={Styles.subHeading}>Our AI is your personal trading coach. Start your free trial to see it in action.</p>
      <img className={Styles.dotImage} src={dotBackground} alt="" />
      <img className={Styles.dotImage2} src={dotBackground} alt="" />
    </div>
  )
}

export default TopBanner
