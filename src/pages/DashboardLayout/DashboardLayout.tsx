import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import Styles from './DashboardLayout.module.css';
import { PiSidebar } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { useState } from "react";


const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  
  return (
    <div className={Styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={`${Styles.dashboardSidebar} ${
        sidebarCollapsed ? Styles.collapsed : Styles.notCollapsed
      }`}>
        <div 
          className={Styles.sidebarIconContainer} 
          onClick={() => setSidebarCollapsed(true)}
        >
          <PiSidebar className={Styles.sidebarIcon} />
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={`${Styles.dashboardContent} ${
        sidebarCollapsed ? Styles.expand : ''
      }`}>
        <div className={Styles.dashboardNavbarContainer}>
          <div className={Styles.dashboardNavbar}>
            <div className={Styles.navbarLeft}>
              <div 
                className={`${Styles.sidebarIconNav} ${sidebarCollapsed ? Styles.showIcon : ''} `}
                onClick={() => setSidebarCollapsed(false)}
              >
                <PiSidebar className={Styles.sidebarI} />
              </div>
              <div className={Styles.dashboardUrl}>
                <div className={Styles.dashAndIcon}>
                  <RiDashboardLine className={Styles.dashboardIcon} /> 
                  <p className={Styles.dashboard}>Dashboard</p> 
                </div>
                <p className={Styles.url}>{location.pathname}</p>
              </div>
            </div>
            <div className={Styles.dashboardRight}>
              <div className={Styles.plusContainer}>
                <GoPlus className={Styles.plusIcon} />
              </div>
              <p className={Styles.createTrade}>New trade</p>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;