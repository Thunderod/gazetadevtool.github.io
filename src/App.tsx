import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { AppsList } from './pages/AppsList';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IntegrationDocs } from './pages/IntegrationDocs';
import { Settings } from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { CommandPalette } from './components/CommandPalette';

function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gazeta-theme">
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <CommandPalette />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="apps" element={<AppsList />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="docs" element={<IntegrationDocs />} />
                <Route path="payouts" element={<div className="text-slate-500 p-8 text-center font-medium">Payouts Dashboard (Coming soon)</div>} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
