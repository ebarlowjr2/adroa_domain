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
import OrgConfirm from "./pages/org/OrgConfirm";
import Dashboard from "./pages/dashboard/Dashboard";
import Employees from "./pages/dashboard/Employees";
import Training from "./pages/dashboard/Training";
import Readiness from "./pages/dashboard/Readiness";
import TrainingReport from "./pages/dashboard/TrainingReport";
import { ProtectedRoute } from "./components/dashboard/ProtectedRoute";

/* VCM — Virtual Certification Manager */
import { VcmAuthProvider } from "./contexts/VcmAuthContext";
import { VcmProtectedRoute } from "./components/vcm/VcmProtectedRoute";
import VcmLanding from "./pages/vcm/VcmLanding";
import VcmLogin from "./pages/vcm/VcmLogin";
import VcmSignup from "./pages/vcm/VcmSignup";
import VcmDashboard from "./pages/vcm/VcmDashboard";
import VcmCertifications from "./pages/vcm/VcmCertifications";
import VcmNewCertification from "./pages/vcm/VcmNewCertification";
import VcmTrainingLog from "./pages/vcm/VcmTrainingLog";
import VcmOpportunities from "./pages/vcm/VcmOpportunities";
import VcmProfile from "./pages/vcm/VcmProfile";
import VcmConfirm from "./pages/vcm/VcmConfirm";

function VcmRoutes() {
  return (
    <VcmAuthProvider>
      <Routes>
        <Route path="/" element={<VcmLanding />} />
        <Route path="/login" element={<VcmLogin />} />
        <Route path="/signup" element={<VcmSignup />} />
        <Route path="/confirm" element={<VcmConfirm />} />
        <Route path="/dashboard" element={<VcmProtectedRoute><VcmDashboard /></VcmProtectedRoute>} />
        <Route path="/certifications" element={<VcmProtectedRoute><VcmCertifications /></VcmProtectedRoute>} />
        <Route path="/certifications/new" element={<VcmProtectedRoute><VcmNewCertification /></VcmProtectedRoute>} />
        <Route path="/training-log" element={<VcmProtectedRoute><VcmTrainingLog /></VcmProtectedRoute>} />
        <Route path="/opportunities" element={<VcmProtectedRoute><VcmOpportunities /></VcmProtectedRoute>} />
        <Route path="/profile" element={<VcmProtectedRoute><VcmProfile /></VcmProtectedRoute>} />
      </Routes>
    </VcmAuthProvider>
  );
}

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
      <Route path="/org/confirm" element={<OrgConfirm />} />

      {/* Dashboard (protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/dashboard/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
      <Route path="/dashboard/training-report" element={<ProtectedRoute><TrainingReport /></ProtectedRoute>} />
      <Route path="/dashboard/readiness" element={<ProtectedRoute><Readiness /></ProtectedRoute>} />

      {/* VCM — Virtual Certification Manager */}
      <Route path="/vcm/*" element={<VcmRoutes />} />

      {/* Auth callback — Supabase redirects here after email confirmation */}
      <Route path="/auth/confirm" element={<VcmConfirm />} />
      <Route path="/confirm" element={<VcmConfirm />} />
    </Routes>
  );
}
