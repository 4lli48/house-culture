import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import DeviceDetails from './pages/DeviceDetails';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { useTranslation } from 'react-i18next';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">{t('loading')}</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="devices" element={<Devices />} />
            <Route path="devices/new" element={<DeviceDetails />} />
            <Route path="devices/:id" element={<DeviceDetails />} />
            <Route path="devices/:id/edit" element={<DeviceDetails />} />
            <Route path="categories" element={<Categories />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
