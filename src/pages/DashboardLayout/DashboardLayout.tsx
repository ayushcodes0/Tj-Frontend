import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import Styles from './DashboardLayout.module.css';

const DashboardLayout = () => (
  <div className={Styles.dashboardContainer}>
    <div className={Styles.dashboardSidebar}>
        <Sidebar />
    </div>
    <div className={Styles.dashboardContent}>
        <Outlet />
    </div>
  </div>
);
export default DashboardLayout;
