import PricingNav from "../../components/PricingNav/PricingNav"
import Styles from "./PricingPage.module.css"
const PricingPage = () => {
  return (
    <div className={Styles.pricingPageContainer}>
      <div className={Styles.pricingNavContainer}><PricingNav/></div>
    </div>
  )
}

export default PricingPage
