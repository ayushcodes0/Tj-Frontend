import Styles from './Sidebar.module.css';
import { FaArrowTrendUp, FaRegSun } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { MdElectricBolt } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
// import PlaceholderImage from "../../assets/image/placeholderImage.jpg";
import { PiSidebar } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { useState } from 'react';
import UserProfilePopup from '../UserProfilePopup/UserProfilePopup';





const Sidebar = () =>{ 

    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const { user, logout } = useAuth();

    
return (
  <div className={Styles.sidebar}>
    <div className={Styles.sidebarTopSection}>
        <div className={Styles.userInfo}>
            <div className={Styles.userProfile} onClick={()=>setShowProfilePopup(!showProfilePopup)}>
                <div className={Styles.userIcon}>
                    <p className={Styles.firstLetter}>
                        {user?.username?.[0].toUpperCase()}
                    </p>
                </div>
                <div className={Styles.usernameContainer}>
                    <p className={Styles.username}>{user?.username}</p>
                    <IoIosArrowDown className={Styles.downArrowIcon} />
                </div>
            </div>
            <div className={Styles.sidebarIconContainer}><PiSidebar className={Styles.sidebarIcon} /></div>
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
    <div className={Styles.sidebarBottom}>
        <div className={Styles.bottomOptions}>
            <div className={Styles.bottomLeft} onClick={logout}>
                <IoMdLogOut className={Styles.bottomIcons} />
                <span className={Styles.bottomTexts}>Logout</span>
            </div>
            <div className={Styles.bottomDivider}></div>
            <div className={Styles.bottomRight}>
                <BsQuestionCircle className={Styles.bottomIcon} />
                <span className={Styles.bottomTexts}>Help</span>
            </div>
        </div>
    </div>
    {showProfilePopup && (
        <UserProfilePopup
            onClose={() => setShowProfilePopup(false)}
            user={user}
        />
        )}
  </div>
)}

export default Sidebar;
