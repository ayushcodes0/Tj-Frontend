// Sidebar.tsx - Updated to work with your DashboardLayout
import Styles from './Sidebar.module.css';
import { FaMoon, FaShieldAlt, FaCrown } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import { IoIosArrowDown, IoMdLogOut } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { BsQuestionCircle } from "react-icons/bs";
import { useState, useRef, useEffect } from 'react';
import UserProfilePopup from '../UserProfilePopup/UserProfilePopup';
import { IoSettingsOutline, IoStatsChartSharp } from "react-icons/io5";
import { LuBrain } from 'react-icons/lu';
import { TbCalendarMonthFilled } from 'react-icons/tb';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useTheme } from '../../hooks/useTheme'; 
import { GoSun } from "react-icons/go";

interface SidebarProps {
  onNewTradeClick: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewTradeClick, isCollapsed, onCollapse }) => { 
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme(); 
    const sidebarRef = useRef<HTMLDivElement>(null);
    
    // Logic to truncate the username if it's too long
    const truncatedUsername = user?.username && user.username.length > 15 
        ? `${user.username.substring(0, 12)}...` 
        : user?.username;

    // Click outside effect - only for mobile/smaller screens
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only auto-collapse on smaller screens and when sidebar is expanded
            if (!isCollapsed && 
                window.innerWidth < 1000 && // Same as your COLLAPSE_BREAKPOINT
                sidebarRef.current && 
                !sidebarRef.current.contains(event.target as Node)) {
                onCollapse();
                setShowProfilePopup(false);
            }
        };

        // Only add listener if sidebar is expanded and on smaller screens
        if (!isCollapsed && window.innerWidth < 1000) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCollapsed, onCollapse]);

    // Close popup when sidebar collapses
    useEffect(() => {
        if (isCollapsed) {
            setShowProfilePopup(false);
        }
    }, [isCollapsed]);

    return (
        <div ref={sidebarRef} className={`${Styles.sidebar} ${isCollapsed ? Styles.collapsed : ''}`}>
            <div className={Styles.sidebarTopSection}>
                <div className={Styles.userInfo}>
                    <div className={Styles.userProfile} onClick={() => setShowProfilePopup(!showProfilePopup)}>
                        <div className={Styles.userIconContainer}>
                            <FaCrown className={Styles.crownIcon} />
                            <div className={Styles.userIcon}>
                                <p className={Styles.firstLetter}>
                                    {user?.username?.[0].toUpperCase()}
                                </p>
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className={Styles.usernameContainer}>
                                <p className={Styles.username}>{truncatedUsername}</p>
                                <IoIosArrowDown className={Styles.downArrowIcon} />
                            </div>
                        )}
                    </div>
                </div>
                <div className={Styles.sidebarNavContainer}>
                    <nav className={Styles.sidebarNav}>
                        <NavLink 
                            to="/dashboard" 
                            end 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Dashboard"
                        >
                            <RiDashboardLine className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Dashboard</span>}
                        </NavLink>
                        <NavLink 
                            to="/dashboard/trades" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Trades"
                        >
                            <FaArrowTrendUp className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Trades</span>}
                        </NavLink>
                        <NavLink 
                            to="/dashboard/performance" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Performance"
                        >
                            <IoStatsChartSharp className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Performance</span>}
                        </NavLink>
                        <NavLink 
                            to="/dashboard/monthly-progress" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Monthly Progress"
                        >
                            <TbCalendarMonthFilled className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Monthly Progress</span>}
                        </NavLink>
                        <NavLink 
                            to="/dashboard/ai-insights" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="AI Insights"
                        >
                            <FaRegLightbulb className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>AI Insights</span>}
                        </NavLink>
                    </nav>
                </div>
                <div className={Styles.sidebarNavContainer}>
                    <nav className={Styles.sidebarNav}>
                        <NavLink 
                            to="/dashboard/risk" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Risk"
                        >
                            <FaShieldAlt className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Risk</span>}
                        </NavLink>
                        <NavLink 
                            to="/dashboard/psychology" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Psychology"
                        >
                            <LuBrain className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Psychology</span>}
                        </NavLink>
                        <NavLink 
                            to="/dashboard/settings" 
                            className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}
                            data-tooltip="Settings"
                        >
                            <IoSettingsOutline className={Styles.sideIcon} />
                            {!isCollapsed && <span className={Styles.navTexts}>Settings</span>}
                        </NavLink>
                    </nav>
                </div>
                {!isCollapsed && (
                    <div className={Styles.themeToggleContainer}>
                        <div className={Styles.themeToggle} onClick={toggleTheme}>
                            {theme === 'light' ? <FaMoon className={Styles.themeIcon} /> : <GoSun className={Styles.themeIcon} />}
                            <span className={Styles.themeText}>
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className={Styles.sidebarBottom}>
                <div className={Styles.bottomOptions}>
                    <div className={Styles.bottomLeft} onClick={logout}>
                        <IoMdLogOut className={Styles.bottomIcons} />
                        {!isCollapsed && <span className={Styles.bottomTexts}>Logout</span>}
                    </div>
                    {!isCollapsed && <div className={Styles.bottomDivider}></div>}
                    <NavLink to={"/dashboard/help"} className={Styles.bottomRight}>
                        <BsQuestionCircle className={Styles.bottomIcons} />
                        {!isCollapsed && <span className={Styles.bottomTexts}>Help</span>}
                    </NavLink>
                </div>
            </div>
            {showProfilePopup && !isCollapsed && (
                <UserProfilePopup
                    onClose={() => setShowProfilePopup(false)}
                    user={user}
                    onNewTradeClick={onNewTradeClick}
                />
            )}
        </div>
    );
};

export default Sidebar;
