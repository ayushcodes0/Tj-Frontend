import Styles from './UserProfilePopup.module.css'
import type { User } from '../../types/AuthTypes';
import { NavLink } from 'react-router-dom';
import { RiDashboardLine } from 'react-icons/ri';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdElectricBolt } from 'react-icons/md';
import { GoPlus } from "react-icons/go";

interface UserProfilePopupProps {
  onClose: () => void;
  user: User | null;    
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ user }) => {
  return (
    <div className={Styles.userProfilePopup}>
      <div className={Styles.popupContainer}>
        <div className={Styles.profileInfo}>
            <div className={Styles.userIcon}>
                <p className={Styles.firstLetter}>{user?.username[0].toUpperCase()}</p>
            </div>
            <div className={Styles.userInfo}>
                <p className={Styles.name}>{user?.username}'s Dashboard</p>
                <p className={Styles.email}>{user?.email}</p>
            </div>
        </div>
        <div className={Styles.popupNav}>
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
        </div>
        <div className={`${Styles.popupNav} ${Styles.secondPopupNav}`}>
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
        </div>
        <div className={Styles.popupBottom}>
            <div className={Styles.bottomItems}>
                <div className={Styles.plusIconContainer}><GoPlus className={Styles.plusIcon} /></div>
                <p className={Styles.popupBottomText}>Create Trade</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePopup;

