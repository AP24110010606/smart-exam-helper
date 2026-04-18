import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UploadMaterial from './pages/UploadMaterial';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import StudyPlan from './pages/StudyPlan';
import ProgressTracker from './pages/ProgressTracker';
import Settings from './pages/Settings';

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-matte-cream dark:bg-matte-night">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function LandingRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-matte-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingRoute />} />
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              }
            />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadMaterial />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/study-plan" element={<StudyPlan />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
