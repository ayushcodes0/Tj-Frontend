import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import Styles from './DashboardLayout.module.css';
import { PiSidebar } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";



const DashboardLayout = () => {
  
  return(
  <div className={Styles.dashboardContainer}>
    <div className={Styles.dashboardSidebar}>
        <Sidebar />
    </div>
    <div className={Styles.dashboardContent}>
      <div className={Styles.dashboardNavbarContainer}>
        <div className={Styles.dashboardNavbar}>
          <div className={Styles.navbarLeft}>
            <div className={Styles.sidebarIconContainer}><PiSidebar className={Styles.sidebarIcon} /></div>
            <div className={Styles.dashboardUrl}>
              <div className={Styles.dashAndIcon}>
                <RiDashboardLine className={Styles.dashboardIcon} />
                <p className={Styles.dashboard}>Dashboard</p>
              </div>
              <p className={Styles.url}>/ dashboard</p>
            </div>
          </div>
          <div className={Styles.dashboardRight}>
              <div className={Styles.plusContainer}>
                <GoPlus className={Styles.plusIcon} />
              </div>
              <p className={Styles.createTrade}>New Trade</p>
          </div>
        </div>
      </div>
        <Outlet />
    </div>
  </div>
)};
export default DashboardLayout; 
