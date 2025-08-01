import PricingNav from "../../components/PricingNav/PricingNav"
import Styles from "./PricingPage.module.css"
const PricingPage = () => {
  return (
    <div className={Styles.pricingPageContainer}>
      <div className={Styles.pricingNavContainer}><PricingNav/></div>
      <div className={Styles.pricingCards}></div>
    </div>
  )
}

export default PricingPage
