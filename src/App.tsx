import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import LearningPaths from "./pages/LearningPaths";
import StarterProjects from "./pages/StarterProjects";
import ScapScanningGuide from "./pages/ScapScanningGuide";
import PenTestingLabs from "./pages/PenTestingLabs";
import CybersecurityFrameworks from "./pages/CybersecurityFrameworks";
import LoginBypassLab from "./pages/LoginBypassLab";
import XSSLab from "./pages/XSSLab";
import IDORLab from "./pages/IDORLab";
import PriceTamperingLab from "./pages/PriceTamperingLab";
import JWTLab from "./pages/JWTLab";
import GetStarted from "./pages/GetStarted";
import Signup from "./pages/org/Signup";
import Login from "./pages/org/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Employees from "./pages/dashboard/Employees";
import Training from "./pages/dashboard/Training";
import Readiness from "./pages/dashboard/Readiness";
import TrainingReport from "./pages/dashboard/TrainingReport";
import { ProtectedRoute } from "./components/dashboard/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/learning-paths" element={<LearningPaths />} />
      <Route path="/starter-projects" element={<StarterProjects />} />
      <Route path="/scap-scanning-guide" element={<ScapScanningGuide />} />
      <Route path="/pen-testing-labs" element={<PenTestingLabs />} />
      <Route path="/cybersecurity-frameworks" element={<CybersecurityFrameworks />} />
      <Route path="/lab/login-bypass-sqli" element={<LoginBypassLab />} />
      <Route path="/lab/stored-reflected-xss" element={<XSSLab />} />
      <Route path="/lab/idor-rest-endpoints" element={<IDORLab />} />
      <Route path="/lab/price-quantity-tampering" element={<PriceTamperingLab />} />
      <Route path="/lab/jwt-cookie-manipulation" element={<JWTLab />} />

      {/* Get Started */}
      <Route path="/get-started" element={<GetStarted />} />

      {/* Auth */}
      <Route path="/org/signup" element={<Signup />} />
      <Route path="/org/login" element={<Login />} />

      {/* Dashboard (protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/dashboard/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
      <Route path="/dashboard/training-report" element={<ProtectedRoute><TrainingReport /></ProtectedRoute>} />
      <Route path="/dashboard/readiness" element={<ProtectedRoute><Readiness /></ProtectedRoute>} />
    </Routes>
  );
}
