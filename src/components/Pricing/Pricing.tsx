import Styles from './Pricing.module.css';
import planeImage from '../../assets/image/pricingPlane.webp';
import pricingBottomImage from '../../assets/image/pricingSectionImage.svg';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Faster animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05, // Reduced from 0.1
      duration: 0.4, // Reduced from 0.6
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3, // Reduced from 0.5
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

const planeVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1, // Reduced from 0.2
      duration: 0.5, // Reduced from 0.7
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

const priceCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + i * 0.05, // Reduced delays
      duration: 0.4, // Reduced from 0.6
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  })
};

const bottomImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.15, // Reduced from 0.3
      duration: 0.4, // Reduced from 0.6
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
      variants={containerVariants}
    >
      <div className={Styles.pricingHeading}>
        <motion.p 
          className={Styles.heading}
          variants={itemVariants}
        >
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
      
      <motion.div 
        className={Styles.pricingBottom}
        variants={containerVariants}
      >
        <div className={Styles.pricesContainer}>
          {/* Free Trial Plan */}
          <motion.div 
            className={Styles.prices}
            variants={priceCardVariants}
            custom={0}
          >
            <p className={Styles.pricesTop}>Free Trial</p>
            <p className={Styles.pricesHeading}>₹0 for 24 Hours</p>
            <div className={Styles.pricesPoints}>
              <p className={Styles.pricesPointsText}>Full access to all Pro features.</p>
              <p className={Styles.pricesPointsText}>Log unlimited trades during the trial.</p>
              <p className={Styles.pricesPointsText}>Experience our AI-powered insights firsthand.</p>
              <p className={Styles.pricesPointsText}>No credit card required to start.</p>
            </div>
            <p className={Styles.pricesButton}>Start Free Trial</p>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div 
            className={Styles.prices}
            variants={priceCardVariants}
            custom={1}
          >
            <p className={Styles.pricesTop}>Pro Plan</p>
            <p className={Styles.pricesHeading}>₹99 per month</p>
            <div className={Styles.pricesPoints}>
              <p className={Styles.pricesPointsText}>Everything from the free trial, plus:</p>
              <p className={Styles.pricesPointsText}>Unlimited trade logging, forever.</p>
              <p className={Styles.pricesPointsText}>In-depth performance and psychology analytics.</p>
              <p className={Styles.pricesPointsText}>Secure, long-term cloud backup for your data.</p>
            </div>
            <p className={Styles.pricesButton}>Choose Pro</p>
          </motion.div>
        </div>
        
        <motion.div 
          className={Styles.pricingBottomImage}
          variants={bottomImageVariants}
        >
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