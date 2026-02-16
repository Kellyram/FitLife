import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import ClientsPage from "@/pages/ClientsPage"
import TemplatesPage from "@/pages/TemplatesPage"
import SettingsPage from "@/pages/SettingsPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { TrainerLayout } from "@/components/TrainerLayout"
import { useAuth } from "./context/AuthContext"

function ProtectedWithLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <TrainerLayout>{children}</TrainerLayout>
    </ProtectedRoute>
  )
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* Protected routes with sidebar layout */}
      <Route path="/dashboard" element={<ProtectedWithLayout><DashboardPage /></ProtectedWithLayout>} />
      <Route path="/clients" element={<ProtectedWithLayout><ClientsPage /></ProtectedWithLayout>} />
      <Route path="/templates" element={<ProtectedWithLayout><TemplatesPage /></ProtectedWithLayout>} />
      <Route path="/settings" element={<ProtectedWithLayout><SettingsPage /></ProtectedWithLayout>} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
