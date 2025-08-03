import { NavLink } from "react-router-dom";
import Styles from './Sidebar.module.css';
import { FaArrowTrendUp, FaRegSun } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { MdElectricBolt } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import PlaceholderImage from "../../assets/image/placeholderImage.jpg";
import { FiLogOut } from "react-icons/fi";




const Sidebar = () =>{ 
    
    const { user, logout } = useAuth();

    
return (
  <div className={Styles.sidebar}>
    <div className={Styles.sidebarHeader}>
        <p className={Styles.logo}>LoremIpsum</p>
        <div className={Styles.sidebarDivider} />
        <nav className={Styles.sidebarNav}>
            <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                `${Styles.sidebarNavLink} ${Styles.dashboardLink} ${isActive ? Styles.active : ""}`
                }
            >
                <RiDashboardLine className={Styles.sideIcon} />
                <span>Dashboard</span>
            </NavLink>
            <NavLink
                to="/dashboard/trades"
                className={({ isActive }) =>
                `${Styles.sidebarNavLink} ${Styles.tradesLink} ${isActive ? Styles.active : ""}`
                }
            >
                <FaArrowTrendUp className={Styles.sideIcon} />
                <span>Trades</span>
            </NavLink>
            <NavLink
                to="/dashboard/performance"
                className={({ isActive }) =>
                `${Styles.sidebarNavLink} ${Styles.performanceLink} ${isActive ? Styles.active : ""}`
                }
            >
                <MdElectricBolt className={Styles.sideIcon} />
                <span>Performance</span>
            </NavLink>
            <NavLink
                to="/dashboard/ai-insights"
                className={({ isActive }) =>
                `${Styles.sidebarNavLink} ${Styles.aiInsightsLink} ${isActive ? Styles.active : ""}`
                }
            >
                <FaRegLightbulb className={Styles.sideIcon} />
                <span>AI Insights</span>
            </NavLink>
            <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                `${Styles.sidebarNavLink} ${Styles.settingsLink} ${isActive ? Styles.active : ""}`
                }
            >
                <FaRegSun className={Styles.sideIcon} />
                <span>Settings</span>
            </NavLink>
        </nav>
    </div>
    <div className={Styles.sidebarFooter}>
        {user && (
            <div className={Styles.profileArea}>
                <div className={Styles.profileInfo}>
                    <img
                    src={user.avatar || PlaceholderImage}
                    alt={user.username}
                    className={Styles.sidebarProfileImg}
                    />
                </div>
                <button className={Styles.sidebarLogout} onClick={logout} title="Log out">
                    <FiLogOut size={19} className={Styles.sidebarLogoutIcon} />
                </button>
            </div>
        )}
    </div>
  </div>
)}

export default Sidebar;
