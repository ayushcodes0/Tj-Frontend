// import { NavLink } from "react-router-dom";
import Styles from './Sidebar.module.css';
// import { FaArrowTrendUp, FaRegSun } from "react-icons/fa6";
// import { FaRegLightbulb } from "react-icons/fa";
// import { RiDashboardLine } from "react-icons/ri";
// import { MdElectricBolt } from "react-icons/md";
// import { useAuth } from "../../hooks/useAuth";
// import PlaceholderImage from "../../assets/image/placeholderImage.jpg";
// import { FiLogOut } from "react-icons/fi";
import { PiSidebarThin } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";





const Sidebar = () =>{ 
    
    // const { user, logout } = useAuth();

    
return (
  <div className={Styles.sidebar}>
    <div className={Styles.userInfo}>
        <div className={Styles.userProfile}>
            <div className={Styles.userIcon}>
                <p className={Styles.firstLetter}>A</p>
            </div>
            <div className={Styles.usernameContainer}>
                <p className={Styles.username}>Ayush Singh</p>
                <IoIosArrowDown className={Styles.downArrowIcon} />
            </div>
        </div>
        <div className={Styles.sidebarIconContainer}><PiSidebarThin className={Styles.sidebarIcon} /></div>
    </div>
  </div>
)}

export default Sidebar;
