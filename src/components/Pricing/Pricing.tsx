import Styles from './Pricing.module.css';
import planeImage from '../../assets/image/pricingPlane.webp';
import pricingBottomImage from '../../assets/image/pricingSectionImage.svg';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

const planeVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.5,
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

const Pricing = () => {
  return (
    <motion.div 
      className={Styles.pricing}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className={Styles.pricingHeading}>
        <motion.p className={Styles.heading}>
          Find the Perfect Plan for Your Trading Journey.
        </motion.p>
        <motion.div 
          className={Styles.planeImage}
          variants={planeVariants}
        >
          <img 
            className={Styles.planeImg} 
            width={190} 
            src={planeImage} 
            alt="Paper plane" 
          />
        </motion.div>
      </div>
      
      <motion.div className={Styles.pricingBottom}>
        <div className={Styles.pricesContainer}>
          
          {/* Premium Plan */}
          <motion.div className={Styles.prices}>
            <p className={Styles.pricesTop}>Premium</p>
            <p className={Styles.pricesHeading}>₹99</p>
            <p className={Styles.pricesSubtitle}>Flexible with month-to-month access.</p>
            <div className={Styles.pricesPoints}>
              <p className={Styles.pricesPointsText}>Unlimited trade logging with no limits</p>
              <p className={Styles.pricesPointsText}>AI-powered in-depth performance insights</p>
              <p className={Styles.pricesPointsText}>Risk management tools</p>
              <p className={Styles.pricesPointsText}>Secured, long-term cloud backup for your data</p>
              <p className={Styles.pricesPointsText}>Standard support</p>
            </div>
            <Link to={"/pricing"}><p className={Styles.pricesButton}>Choose Premium</p></Link>
          </motion.div>
          
          {/* Premium Plus Plan */}
          <motion.div className={Styles.prices}>
            <p className={Styles.pricesTop}>Premium Plus</p>
            <p className={Styles.pricesHeading}>₹799</p>
            <p className={Styles.pricesSubtitle}>Save over 80% - limited time offer</p>
            <p className={Styles.pricesEffective}>(Just ₹66/month)</p>
            <div className={Styles.pricesPoints}>
              <p className={Styles.pricesPointsText}>Unlimited trade logging with no limits</p>
              <p className={Styles.pricesPointsText}>AI-powered in-depth performance insights</p>
              <p className={Styles.pricesPointsText}>Risk management tools</p>
              <p className={Styles.pricesPointsText}>Secured, long-term cloud backup for your data</p>
              <p className={Styles.pricesPointsText}>Priority support</p>
              <p className={Styles.pricesPointsText}>Advanced analytics dashboard</p>
            </div>
            <Link to={"/pricing"}><p className={Styles.pricesButton}>Choose Premium Plus</p></Link>
          </motion.div>
        </div>
        
        <motion.div className={Styles.pricingBottomImage}>
          <img 
            className={Styles.bottomImage} 
            src={pricingBottomImage} 
            alt="Decorative graphic" 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Pricing;