import { FilledButton, UnfilledButton } from '../Button/Button'
import Styles from './Navbar.module.css'
const Navbar = () => {
  return (
    <div className={Styles.navbar}>
      <p className={Styles.logo}>LoremIpsum</p>
      <div className={Styles.navLinks}>
        <a href="#home" className={Styles.navLink}>Home</a>
        <a href="#about" className={Styles.navLink}>About</a>
        <a href="#services" className={Styles.navLink}>Services</a>
        <a href="#contact" className={Styles.navLink}>Contact</a>
      </div>
      <div className={Styles.buttons}>
        <UnfilledButton text="Login" />
        <FilledButton text="Get Started" />
      </div>
    </div>
  )
}

export default Navbar
