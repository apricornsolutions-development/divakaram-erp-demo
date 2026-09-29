import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import SmartReceiving from "./pages/SmartReceiving";
import RefurbishmentPipeline from "./pages/RefurbishmentPipeline";
import Dispatch from "./pages/Dispatch";
import SecurityGate from "./pages/SecurityGate";
import RackPlacement from "./pages/RackPlacement";
import OwnerDashboard from "./pages/OwnerDashboard";
import AuditTrail from "./pages/AuditTrail";
import BulkAudit from "./pages/BulkAudit";
import Vendors from "./pages/Vendors";
import MissingDevices from "./pages/MissingDevices";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('divakaram_auth') === 'true';
  return isAuthenticated ? children : <Navigate replace to="/login"/>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="receiving" element={<SmartReceiving />} />
          <Route path="rack-placement" element={<RackPlacement />} />
          <Route path="pipeline" element={<RefurbishmentPipeline />} />
          <Route path="dispatch" element={<Dispatch />} />
          <Route path="security-gate" element={<SecurityGate />} />
          <Route path="owner" element={<OwnerDashboard />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="bulk-audit" element={<BulkAudit />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="missing" element={<MissingDevices />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
