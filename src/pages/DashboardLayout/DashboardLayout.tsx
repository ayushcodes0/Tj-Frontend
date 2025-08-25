// DashboardLayout.tsx - Updated to support editing a trade
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import NewTradePopup from "../../components/NewTradePopup/NewTradePopup";
import Styles from './DashboardLayout.module.css';
import { PiSidebar } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import type { Trade } from "../../context/TradeContext"; // Import the Trade type

const COLLAPSE_BREAKPOINT = 1000;

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < COLLAPSE_BREAKPOINT);
  const [showNewTradePopup, setShowNewTradePopup] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null); // New state to hold trade data for editing
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < COLLAPSE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handler to open the popup for a new trade
  const handleNewTradeClick = () => {
    setTradeToEdit(null); // Ensure no trade is being edited
    setShowNewTradePopup(true);
  };
  
  // New handler to open the popup for an existing trade
  const handleEditTradeClick = (trade: Trade) => {
    setTradeToEdit(trade);
    setShowNewTradePopup(true);
  };

  // Handler to close the popup and reset the state
  const handleClosePopup = () => {
    setShowNewTradePopup(false);
    setTradeToEdit(null); // Reset the trade to be edited
  };

  // Handler to collapse sidebar (for click-outside functionality)
  const handleCollapseSidebar = () => {
    setSidebarCollapsed(true);
  };

  return (
    <div className={Styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={`${Styles.dashboardSidebar} ${
        sidebarCollapsed ? Styles.collapsed : Styles.notCollapsed
      }`}>
        <div 
          className={Styles.sidebarIconContainer} 
          onClick={handleCollapseSidebar}
        >
          <PiSidebar className={Styles.sidebarIcon} />
        </div>
        {/* Updated Sidebar with new props */}
        <Sidebar 
          onNewTradeClick={handleNewTradeClick} 
          isCollapsed={sidebarCollapsed}
          onCollapse={handleCollapseSidebar}
        />
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
        <Outlet context={{ handleEditTradeClick }} /> {/* Pass the handler to child components */}
      </div>

      {/* Conditionally render the popup */}
      {showNewTradePopup && (
        <NewTradePopup 
          onClose={handleClosePopup}
          tradeToEdit={tradeToEdit} // Pass the trade data to the popup
        />
      )}
    </div>
  );
};

export default DashboardLayout;