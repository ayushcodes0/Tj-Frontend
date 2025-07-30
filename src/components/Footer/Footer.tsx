import Styles from './Footer.module.css';
const Footer = () => {
  return (
    <div className={Styles.footerWrapper}>
      <div className={Styles.footer}>
      <div className={Styles.footerLogo}>
        <p className={Styles.logo}>LoremIpsum</p> 
      </div>
      <div className={Styles.footerContent}>
        <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Lorem</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum dolor.</p>
            <p className={Styles.footerItemsText}>Lorem ipsum dolor sit.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum dolor.</p>
        </div>
        <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Lorem</p>
            <p className={Styles.footerItemsText}>Lorem ipsum dolor sit amet.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum dolor.</p>
            <p className={Styles.footerItemsText}>lorem</p>
        </div>
        <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Lorem</p>
            <p className={Styles.footerItemsText}>Lorem ipsum dolor sit amet.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum dolor.</p>
            <p className={Styles.footerItemsText}>lorem</p>
        </div>
        <div className={Styles.footerItems}>
            <p className={Styles.footerItemsHead}>Lorem</p>
            <p className={Styles.footerItemsText}>Lorem ipsum dolor sit amet.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum.</p>
            <p className={Styles.footerItemsText}>Lorem, ipsum dolor.</p>
            <p className={Styles.footerItemsText}>lorem</p>
        </div>
      </div>
    </div>
      <div className={Styles.footerBottom}>
        <p className={Styles.footerBottomText}>© 2023 LoremIpsum. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
