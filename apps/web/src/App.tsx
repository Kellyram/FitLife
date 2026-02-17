import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AuthSync } from "@/components/AuthSync"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { OnboardingGuard } from "@/components/OnboardingGuard"
import AppLayout from "@/layouts/AppLayout"
import { useAuth } from "./context/AuthContext"
import { useUserStore } from "./store/useUserStore"

// Route-level code splitting — each page loads only when navigated to
const Landing = lazy(() => import("@/pages/Landing"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const SignupPage = lazy(() => import("@/pages/SignupPage"))
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"))
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const GoalsPage = lazy(() => import("@/pages/GoalsPage"))
const SchedulePage = lazy(() => import("@/pages/SchedulePage"))
const AchievementsPage = lazy(() => import("@/pages/AchievementsPage"))
const ProfilePage = lazy(() => import("@/pages/ProfilePage"))
const SettingsPage = lazy(() => import("@/pages/SettingsPage"))
const TrainersPage = lazy(() => import("@/pages/TrainersPage"))
const WorkoutsPage = lazy(() => import("@/pages/WorkoutsPage"))
const NutritionPage = lazy(() => import("@/pages/NutritionPage"))

// Redirects away from /onboarding if already completed
function OnboardingRedirect({ children }: { children: React.ReactNode }) {
  const profile = useUserStore((state) => state.profile)
  if (profile.onboardingComplete) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <Suspense fallback={<PageLoader />}>
          {user ? <Navigate to="/dashboard" replace /> : <Landing />}
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<PageLoader />}>
          {user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        </Suspense>
      } />
      <Route path="/signup" element={
        <Suspense fallback={<PageLoader />}>
          {user ? <Navigate to="/onboarding" replace /> : <SignupPage />}
        </Suspense>
      } />
      <Route path="/onboarding" element={
        <Suspense fallback={<PageLoader />}>
          <ProtectedRoute><OnboardingRedirect><OnboardingPage /></OnboardingRedirect></ProtectedRoute>
        </Suspense>
      } />

      {/* Protected routes with layout + onboarding gate */}
      <Route element={<ProtectedRoute><OnboardingGuard><AppLayout /></OnboardingGuard></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthSync />
      <AppRoutes />
    </Router>
  )
}

export default App
