import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SunlightLeavesBackground from './components/SunlightLeavesBackground';

// Public Pages
import HomePage from './pages/HomePage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import PetDetailsPage from './pages/PetDetailsPage';
import RescueAlertsPage from './pages/RescueAlertsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Authenticated Pages
import ProfilePage from './pages/ProfilePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';

// Role Dashboards
import ShelterDashboardPage from './pages/ShelterDashboardPage';
import ShelterPetsPage from './pages/ShelterPetsPage';
import ShelterApplicationsPage from './pages/ShelterApplicationsPage';
import VolunteerDashboardPage from './pages/VolunteerDashboardPage';

// Dynamic role-based redirect for generic /dashboard path
function RoleAwareDashboardRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'ShelterWorker') {
    return <Navigate to="/shelter/dashboard" replace />;
  }
  if (user?.role === 'Volunteer') {
    return <Navigate to="/volunteer/dashboard" replace />;
  }
  return <Navigate to="/applications" replace />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          {/* Global Option A: Ambient Corner Gradients & Soft Sage Glows animated background layer */}
          <SunlightLeavesBackground />
          <Navbar />
          <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/pets" element={<BrowsePetsPage />} />
              <Route path="/pets/:id" element={<PetDetailsPage />} />
              <Route path="/rescue-alerts" element={<RescueAlertsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Generic /dashboard route redirected based on role */}
              <Route path="/dashboard" element={<RoleAwareDashboardRedirect />} />

              {/* Adopter & General Authenticated Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/:id"
                element={
                  <ProtectedRoute>
                    <ApplicationDetailPage />
                  </ProtectedRoute>
                }
              />

              {/* Shelter Worker Protected Routes */}
              <Route
                path="/shelter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ShelterWorker', 'Admin']}>
                    <ShelterDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelter/pets"
                element={
                  <ProtectedRoute allowedRoles={['ShelterWorker', 'Admin']}>
                    <ShelterPetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelter/applications"
                element={
                  <ProtectedRoute allowedRoles={['ShelterWorker', 'Admin']}>
                    <ShelterApplicationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Volunteer Protected Routes */}
              <Route
                path="/volunteer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Volunteer', 'Admin']}>
                    <VolunteerDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route
                path="*"
                element={
                  <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--color-sage)' }}>404</h1>
                    <p style={{ color: 'var(--color-charcoal-muted)', margin: '1rem 0 2rem' }}>
                      The page you are looking for does not exist in Second Chance.
                    </p>
                    <a
                      href="/"
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: 'var(--color-sage)',
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600
                      }}
                    >
                      Return to Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
