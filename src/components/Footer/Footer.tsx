import Styles from './Footer.module.css';
const Footer = () => {
  return (
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
  )
}

export default Footer
