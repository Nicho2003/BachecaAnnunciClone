/**
 * @file App.jsx
 * @description Root component for the application.
 * Defines the main layout, including the Navbar and routes for all pages.
 * Utilizes ProtectedRoute to manage access to role-specific dashboards and pages.
 */
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardAziendaPage from './pages/DashboardAziendaPage';
import CreateAnnouncementPage from './pages/CreateAnnouncementPage';
import DashboardCandidatoPage from './pages/DashboardCandidatoPage';

// Component Imports
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components (if any specific ones were still inline, they should be imported or defined clearly)
// For example, if there was a NotFoundPage:
// const NotFoundPage = () => <div className="container py-5 text-center"><h2>404 - Pagina Non Trovata</h2></div>;


/**
 * Main application component.
 * Sets up the Navbar and defines all application routes, including public and protected routes.
 * @returns {JSX.Element} The main application structure.
 */
function App() {
  return (
    <> {/* Using Fragment to avoid unnecessary div */}
      <Navbar /> {/* Global navigation bar */}
      <div className="container mt-3"> {/* Main content container with top margin */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes for 'azienda' (Company) */}
          <Route element={<ProtectedRoute allowedRoles={['azienda']} />}>
            <Route path="/dashboard-azienda" element={<DashboardAziendaPage />} />
            <Route path="/annunci/nuovo" element={<CreateAnnouncementPage />} />
            {/* TODO: Add other company-specific routes here, e.g., editing announcements */}
          </Route>

          {/* Protected Routes for 'candidato' (Candidate) */}
          <Route element={<ProtectedRoute allowedRoles={['candidato']} />}>
            <Route path="/dashboard-candidato" element={<DashboardCandidatoPage />} />
            {/* TODO: Add other candidate-specific routes here, e.g., viewing their applications */}
          </Route>

          {/* Optional: An /unauthorized page could be added here if needed if ProtectedRoute redirected to it */}
          {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

          {/* Optional: Catch-all for 404 Not Found - Requires a NotFoundPage component */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
