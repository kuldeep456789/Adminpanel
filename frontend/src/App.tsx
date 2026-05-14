import React, { ReactNode, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "motion/react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Activity from "./pages/Activity";
import OperationalPulse from "./pages/OperationalPulse";
import Settings from "./pages/Settings";
import { useStore } from "./store/useStore";
import { DemoAuthModal } from "./components/ui/DemoAuthModal";
import { DemoModeBanner } from "./components/ui/DemoModeBanner";

// Renders page normally if authenticated, OR in demo mode (with modal overlay after delay)
const DemoOrProtected = ({ children }: { children: ReactNode }) => {
  const { token, isDemoMode, enterDemoMode, setShowAuthModal } = useStore();

  useEffect(() => {
    if (!token && !isDemoMode) {
      // First visit without token → enter demo mode immediately
      enterDemoMode();
    }
  }, [token]);

  useEffect(() => {
    if (isDemoMode) {
      // Auto-show modal after 8 seconds of demo exploration
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isDemoMode]);

  // Authenticated — show real page
  if (token) return <>{children}</>;

  // Demo mode — show page with demo data (data layer handled in each page)
  if (isDemoMode) return <>{children}</>;

  // Neither yet — show nothing briefly while enterDemoMode runs
  return null;
};

// Protects routes that only Admins should see
const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { user, isDemoMode } = useStore();
  
  // In demo mode, we let them see it for exploration
  if (isDemoMode) return <>{children}</>;
  
  // If not admin, redirect to dashboard
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const { theme, showAuthModal } = useStore();

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161A22",
            color: "#E2E6EF",
            border: "1px solid #1E2230",
            fontSize: "14px",
            padding: "12px 16px",
            borderRadius: "10px",
            marginTop: "48px", // Clear the demo banner
          },
        }}
      />

      {/* Global demo mode UI layer */}
      <DemoModeBanner />
      <AnimatePresence>
        {showAuthModal && <DemoAuthModal />}
      </AnimatePresence>

      <Routes>
        {/* Login page — redirect to dashboard if already authed */}
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <DemoOrProtected><Dashboard /></DemoOrProtected>
        } />

        <Route path="/projects" element={
          <DemoOrProtected><Projects /></DemoOrProtected>
        } />

        <Route path="/projects/:id/*" element={
          <DemoOrProtected><ProjectDetail /></DemoOrProtected>
        } />

        <Route path="/activity" element={
          <DemoOrProtected><Activity /></DemoOrProtected>
        } />

        <Route path="/pulse" element={
          <DemoOrProtected>
            <OperationalPulse />
          </DemoOrProtected>
        } />

        <Route path="/settings" element={
          <DemoOrProtected><Settings /></DemoOrProtected>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
