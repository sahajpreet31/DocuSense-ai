import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DataPrivacy from "./pages/DataPrivacy";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import DocumentView from "./pages/DocumentView";
import DemoDashboard from "./pages/DemoDashboard";
import DemoDocumentView from "./pages/DemoDocumentView";

const isLocalDev = import.meta.env.DEV;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/data-privacy" element={<DataPrivacy />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/documents/:id" element={<DocumentView />} />
      <Route
        path="/demo"
        element={isLocalDev ? <DemoDashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/demo/document/:documentId"
        element={isLocalDev ? <DemoDocumentView /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
