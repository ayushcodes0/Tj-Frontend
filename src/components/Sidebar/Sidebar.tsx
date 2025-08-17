import Styles from './Sidebar.module.css';
import { FaMoon, FaShieldAlt, FaSun } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import { IoIosArrowDown, IoMdLogOut } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { BsQuestionCircle } from "react-icons/bs";
import { useState } from 'react';
import UserProfilePopup from '../UserProfilePopup/UserProfilePopup';
import { IoSettingsOutline, IoStatsChartSharp } from "react-icons/io5";
import { LuBrain } from 'react-icons/lu';
import { TbCalendarMonthFilled } from 'react-icons/tb';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useTheme } from '../../hooks/useTheme'; // <--- IMPORT THE HOOK


// Define the interface for the props this component receives
interface SidebarProps {
  onNewTradeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewTradeClick }) => { 
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme(); // <--- USE THE HOOK

    
    return (
        <div className={Styles.sidebar}>
            <div className={Styles.sidebarTopSection}>
                <div className={Styles.userInfo}>
                    <div className={Styles.userProfile} onClick={() => setShowProfilePopup(!showProfilePopup)}>
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
                </div>
                <div className={Styles.sidebarNavContainer}>
                    <nav className={Styles.sidebarNav}>
                        <NavLink to="/dashboard" end className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <RiDashboardLine className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Dashboard</span>
                        </NavLink>
                        <NavLink to="/dashboard/trades" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <FaArrowTrendUp className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Trades</span>
                        </NavLink>
                        <NavLink to="/dashboard/performance" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <IoStatsChartSharp className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Performance</span>
                        </NavLink>
                        <NavLink to="/dashboard/calendar" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <TbCalendarMonthFilled className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Monthly updates</span>
                        </NavLink>
                        <NavLink to="/dashboard/ai-insights" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <FaRegLightbulb className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>AI Insights</span>
                        </NavLink>
                    </nav>
                </div>
                <div className={Styles.sidebarNavContainer}>
                    <nav className={Styles.sidebarNav}>
                        <NavLink to="/dashboard/risk" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <FaShieldAlt className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Risk</span>
                        </NavLink>
                        <NavLink to="/dashboard/psychology" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <LuBrain className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Psychology</span>
                        </NavLink>
                        <NavLink to="/dashboard/settings" className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                            <IoSettingsOutline className={Styles.sideIcon} />
                            <span className={Styles.navTexts}>Settings</span>
                        </NavLink>
                    </nav>
                </div>
            </div>
            <div className={Styles.sidebarBottom}>
                <div className={Styles.themeToggle} onClick={toggleTheme}>
                    {theme === 'light' ? <FaMoon className={Styles.themeIcon} /> : <FaSun className={Styles.themeIcon} />}
                    <span className={Styles.themeText}>
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                </div>
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
                    // Pass the function down to the UserProfilePopup
                    onNewTradeClick={onNewTradeClick}
                />
            )}
        </div>
    );
};

export default Sidebar;
