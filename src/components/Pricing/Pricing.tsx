import Styles from './Pricing.module.css';
import planeImage from '../../assets/image/pricingPlane.webp'
import pricingBottomImage from '../../assets/image/pricingSectionImage.svg';
const Pricing = () => {
  return (
    <div className={Styles.pricing}>
      <div className={Styles.pricingHeading}>
        <p className={Styles.heading}>Choose the right level of risk for different chunks of your change.</p>
        <div className={Styles.planeImage}>
            <img className={Styles.planeImg} width={190} src={planeImage} alt="" />
        </div>
      </div>
      <div className={Styles.pricingBottom}>
        <div className={Styles.pricesContainer}>
            <div className={Styles.prices}>
                <p className={Styles.pricesTop}>Lorem, ipsum.</p>
                <p className={Styles.pricesHeading}>Lorem, ipsum dolor.</p>
                <div className={Styles.pricesPoints}>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing elit..</p>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, cumque.</p>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, cumque.</p>
                </div>
                <p className={Styles.pricesButton}>Lorem</p>
            </div>
            <div className={Styles.prices}>
                <p className={Styles.pricesTop}>Lorem, ipsum.</p>
                <p className={Styles.pricesHeading}>Lorem, ipsum dolor.</p>
                <div className={Styles.pricesPoints}>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, cumque.</p>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi.</p>
                    <p className={Styles.pricesPointsText}>Lorem ipsum dolor sit amet consectetur.</p>
                </div>
                <p className={Styles.pricesButton}>Lorem</p>
            </div>
        </div>
        <div className={Styles.pricingBottomImage}>
            <img className={Styles.bottomImage} src={pricingBottomImage} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Pricing
