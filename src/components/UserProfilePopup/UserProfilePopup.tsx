import Styles from './UserProfilePopup.module.css'
import type { User } from '../../types/AuthTypes';
import { NavLink } from 'react-router-dom';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline, IoStatsChartSharp } from 'react-icons/io5';
import { FaRegLightbulb } from 'react-icons/fa';
import { TbCalendarMonthFilled } from 'react-icons/tb';

interface UserProfilePopupProps {
  onClose: () => void;
  user: User | null;    
  onNewTradeClick: () => void;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ user, onClose, onNewTradeClick }) => {
  
  const handleNewTrade = () => {
    onClose();
    onNewTradeClick(); 
  };

  return (
    <div className={Styles.popupOverlay} onClick={onClose}>
      <div className={Styles.userProfilePopup} onClick={e => e.stopPropagation()}>
        <div className={Styles.popupContainer}>
          <div className={Styles.profileInfo}>
              <div className={Styles.userIcon}>
                  <p className={Styles.firstLetter}>{user?.username?.[0]?.toUpperCase()}</p>
              </div>
              <div className={Styles.userInfo}>
                  <p className={Styles.name}>{user?.username}&apos;s Dashboard</p>
                  <p className={Styles.email}>{user?.email}</p>
              </div>
          </div>
          <div className={Styles.popupNav}>
              <NavLink to="/dashboard/performance" onClick={onClose} className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                    <IoStatsChartSharp className={Styles.sideIcon} />
                    <span className={Styles.navTexts}>Performance</span>
              </NavLink>
              <NavLink to="/dashboard/trades" onClick={onClose} className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                  <FaArrowTrendUp className={Styles.sideIcon} />
                  <span className={Styles.navTexts}>Trades</span>
              </NavLink>
              <NavLink to="/dashboard/ai-insights" onClick={onClose} className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                    <FaRegLightbulb className={Styles.sideIcon} />
                    <span className={Styles.navTexts}>AI Insights</span>
              </NavLink>
          </div>
          <div className={`${Styles.popupNav} ${Styles.secondPopupNav}`}>
              <NavLink to="/dashboard/calendar" onClick={onClose} className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                    <TbCalendarMonthFilled className={Styles.sideIcon} />
                    <span className={Styles.navTexts}>Monthly updates</span>
              </NavLink>
              <NavLink to="/dashboard/settings" onClick={onClose} className={({ isActive }) => `${Styles.sidebarNavLink} ${isActive ? Styles.active : ""}`}>
                    <IoSettingsOutline className={Styles.sideIcon} />
                    <span className={Styles.navTexts}>Settings</span>
              </NavLink>
          </div>
          <div className={Styles.popupBottom} onClick={handleNewTrade}>
              <div className={Styles.bottomItems}>
                  <div className={Styles.plusIconContainer}><GoPlus className={Styles.plusIcon} /></div>
                  <p className={Styles.popupBottomText}>New trade</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePopup;
