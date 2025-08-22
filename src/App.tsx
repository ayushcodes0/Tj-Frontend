import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from  "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Pricing from "./pages/PricingPage/PricingPage";
import { RequirePro } from "./routes/RequirePro";
import { RequireGuest } from "./routes/RequireGuest";
import DashboardLayout from "./pages/DashboardLayout/DashboardLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Trades from "./components/Trades/Trades";
import Performance from "./components/Performance/Performance";
import AiInsights from "./components/AiInsights/AiInsights";
import Settings from "./components/Settings/Settings";
import Psychology from "./components/Psychology/Psychology";
import Risk from "./components/Risk/Risk";
import Calendar from "./components/Calendar/Calendar";
import AuthSuccess from "./components/Auth/AuthSuccess";


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><Register /></RequireGuest>} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route
        path="/dashboard"
        element={<RequirePro><DashboardLayout /></RequirePro>}
      >
        <Route index element={<Dashboard />} />
        <Route path="trades" element={<Trades />} />
        <Route path="performance" element={<Performance />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="ai-insights" element={<AiInsights />} />
        <Route path="psychology" element={<Psychology />} />
        <Route path="risk" element={<Risk />} />
        <Route path="settings" element={<Settings />} />
        {/* Add more nested subroutes as needed */}
      </Route>
    </Routes>
  </Router>
);
export default App;
