/**
 * @file Navbar.jsx
 * @description Application's main navigation bar.
 * Displays different links based on user authentication status and role.
 * Uses Bootstrap for styling and responsiveness.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Renders the main navigation bar for the application.
 * - Displays "JobBoard" brand link.
 * - Shows user's name and role-specific dashboard links if authenticated.
 * - Provides a "Logout" button for authenticated users.
 * - Shows "Login" and "Registrati" links for unauthenticated users.
 * @returns {JSX.Element} The Navbar component.
 */
export default function Navbar() {
  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles the user logout process.
   * Calls the `logout` function from AuthContext and navigates to the login page.
   * @async
   */
  const handleLogout = async () => {
    try {
      await logout(); // AuthContext logout handles clearing state and localStorage
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to logout:", error);
      // This catch block might be for errors if logout ever becomes async and can fail
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">JobBoard</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> {/* ms-auto pushes items to the right */}
            {isAuthenticated ? (
              // Links for authenticated users
              <>
                {user && user.name && (
                  <li className="nav-item">
                    <span className="nav-link">Ciao, {user.name}!</span>
                  </li>
                )}
                {role === 'azienda' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard-azienda">Dashboard Azienda</Link>
                  </li>
                )}
                {role === 'candidato' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard-candidato">Dashboard Candidato</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    style={{ textDecoration: 'none' }} // Makes button look like a link
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Links for unauthenticated users
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrati</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
