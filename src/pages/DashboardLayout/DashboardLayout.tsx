import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import NewTradePopup from "../../components/NewTradePopup/NewTradePopup";
import Styles from './DashboardLayout.module.css';
import { PiSidebar } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";

const COLLAPSE_BREAKPOINT = 1000;

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < COLLAPSE_BREAKPOINT);
  const [showNewTradePopup, setShowNewTradePopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < COLLAPSE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handler to open the popup, passed to children
  const handleNewTradeClick = () => {
    setShowNewTradePopup(true);
  };

  // Handler to close the popup
  const handleClosePopup = () => {
    setShowNewTradePopup(false);
  };

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
        {/* Pass the click handler down to the Sidebar */}
        <Sidebar onNewTradeClick={handleNewTradeClick} />
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
            
            {/* The main "New trade" button in the navbar */}
            <div className={Styles.dashboardRight} onClick={handleNewTradeClick}>
              <div className={Styles.plusContainer}>
                <GoPlus className={Styles.plusIcon} />
              </div>
              <p className={Styles.createTrade}>New trade</p>
            </div>
          </div>
        </div>
        <Outlet />
      </div>

      {/* Conditionally render the popup */}
      {showNewTradePopup && (
        <NewTradePopup onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default DashboardLayout;
