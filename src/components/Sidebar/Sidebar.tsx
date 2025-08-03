// import { NavLink } from "react-router-dom";
import Styles from './Sidebar.module.css';
import { FaArrowTrendUp, FaRegSun } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { MdElectricBolt } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
// import PlaceholderImage from "../../assets/image/placeholderImage.jpg";
// import { FiLogOut } from "react-icons/fi";
import { PiSidebarThin } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from 'react-router-dom';





const Sidebar = () =>{ 
    
    const { user, logout } = useAuth();

    
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
    <div className={Styles.sidebarNavContainer}>
        <nav className={Styles.sidebarNav}>
           <NavLink
               to="/dashboard"
               end
               className={({ isActive }) =>
               `${Styles.sidebarNavLink} ${Styles.dashboardLink} ${isActive ? Styles.active : ""}`
               }
           >
               <RiDashboardLine className={Styles.sideIcon} />
               <span className={Styles.navTexts}>Dashboard</span>
           </NavLink>
           <NavLink
               to="/dashboard/trades"
               className={({ isActive }) =>
               `${Styles.sidebarNavLink} ${Styles.tradesLink} ${isActive ? Styles.active : ""}`
               }
           >
               <FaArrowTrendUp className={Styles.sideIcon} />
               <span className={Styles.navTexts}>Trades</span>
           </NavLink>
           <NavLink
               to="/dashboard/performance"
               className={({ isActive }) =>
               `${Styles.sidebarNavLink} ${Styles.performanceLink} ${isActive ? Styles.active : ""}`
               }
           >
               <MdElectricBolt className={Styles.sideIcon} />
               <span className={Styles.navTexts}>Performance</span>
           </NavLink>
           <NavLink
               to="/dashboard/ai-insights"
               className={({ isActive }) =>
               `${Styles.sidebarNavLink} ${Styles.aiInsightsLink} ${isActive ? Styles.active : ""}`
               }
           >
               <FaRegLightbulb className={Styles.sideIcon} />
               <span className={Styles.navTexts}>AI Insights</span>
           </NavLink>
           <NavLink
               to="/dashboard/settings"
               className={({ isActive }) =>
               `${Styles.sidebarNavLink} ${Styles.settingsLink} ${isActive ? Styles.active : ""}`
               }
           >
               <FaRegSun className={Styles.sideIcon} />
               <span className={Styles.navTexts}>Settings</span>
           </NavLink>
       </nav>
    </div>
  </div>
)}

export default Sidebar;
