import Styles from './Pricing.module.css';
import planeImage from '../../assets/image/pricingPlane.webp'
import pricingBottomImage from '../../assets/image/pricingSectionImage.svg';

const Pricing = () => {
  return (
    <div className={Styles.pricing}>
      <div className={Styles.pricingHeading}>
        <p className={Styles.heading}>Find the Perfect Plan for Your Trading Journey.</p>
        <div className={Styles.planeImage}>
            <img className={Styles.planeImg} width={190} src={planeImage} alt="Paper plane" />
        </div>
      </div>
      <div className={Styles.pricingBottom}>
        <div className={Styles.pricesContainer}>
            {/* Free Trial Plan */}
            <div className={Styles.prices}>
                <p className={Styles.pricesTop}>Free Trial</p>
                <p className={Styles.pricesHeading}>₹0 for 24 Hours</p>
                <div className={Styles.pricesPoints}>
                    <p className={Styles.pricesPointsText}>Full access to all Pro features.</p>
                    <p className={Styles.pricesPointsText}>Log unlimited trades during the trial.</p>
                    <p className={Styles.pricesPointsText}>Experience our AI-powered insights firsthand.</p>
                    <p className={Styles.pricesPointsText}>No credit card required to start.</p>
                </div>
                <p className={Styles.pricesButton}>Start Free Trial</p>
            </div>
            {/* Pro Plan */}
            <div className={Styles.prices}>
                <p className={Styles.pricesTop}>Pro Plan</p>
                <p className={Styles.pricesHeading}>₹99 per month</p>
                <div className={Styles.pricesPoints}>
                    <p className={Styles.pricesPointsText}>Everything from the free trial, plus:</p>
                    <p className={Styles.pricesPointsText}>Unlimited trade logging, forever.</p>
                    <p className={Styles.pricesPointsText}>In-depth performance and psychology analytics.</p>
                    <p className={Styles.pricesPointsText}>Secure, long-term cloud backup for your data.</p>
                </div>
                <p className={Styles.pricesButton}>Choose Pro</p>
            </div>
        </div>
        <div className={Styles.pricingBottomImage}>
            <img className={Styles.bottomImage} src={pricingBottomImage} alt="Decorative graphic" />
        </div>
      </div>
    </div>
  )
}

export default Pricing;
