import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from  "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pricing from "./pages/PricingPage/PricingPage";
import { RequirePro } from "./routes/RequirePro";
import { RequireGuest } from "./routes/RequireGuest";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><Register /></RequireGuest>} />
      <Route path="/dashboard" element={<RequirePro><Dashboard /></RequirePro>} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  </Router>
);
export default App;
