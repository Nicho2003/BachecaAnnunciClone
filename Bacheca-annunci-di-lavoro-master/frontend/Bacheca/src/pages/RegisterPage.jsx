/**
 * @file RegisterPage.jsx
 * @description Page for user registration.
 * Allows new users to register as either a 'candidato' (candidate) or 'azienda' (company).
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AlertMessage from '../components/AlertMessage'; // Import AlertMessage

/**
 * Renders the user registration page.
 * Contains a form for name, email, password, and role selection.
 * Handles form submission, calls the registration function from AuthContext,
 * and redirects upon successful registration and authentication.
 * @returns {JSX.Element} The RegisterPage component.
 */
export default function RegisterPage() {
  /** @state {string} name - The full name input by the user. */
  const [name, setName] = useState('');
  /** @state {string} email - The email address input by the user. */
  const [email, setEmail] = useState('');
  /** @state {string} password - The password input by the user. */
  const [password, setPassword] = useState('');
  /** @state {string} role - The selected role ('candidato' or 'azienda'). Defaults to 'candidato'. */
  const [role, setRole] = useState('candidato');
  /** @state {string} error - Error message related to registration. */
  const [error, setError] = useState('');
  /** @state {boolean} pageLoading - True if the registration process is ongoing (form submission). Renamed from 'loading' to avoid conflict. */
  const [pageLoading, setPageLoading] = useState(false);

  const { register, isAuthenticated, role: userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  /**
   * Effect to redirect users if they become authenticated (e.g., after successful registration).
   * Navigates to the appropriate dashboard based on their role.
   */
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'azienda') {
        navigate('/dashboard-azienda');
      } else if (userRole === 'candidato') {
        navigate('/dashboard-candidato');
      } else {
        navigate('/'); // Fallback if role is somehow not set
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  /**
   * Handles the registration form submission.
   * Calls the `register` function from AuthContext.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setPageLoading(true);
    try {
      // TODO: Ensure AuthContext.register is fully implemented and handles errors properly.
      await register(name, email, password, role);
      // Navigation on success is handled by the useEffect hook watching `isAuthenticated`.
    } catch (err) {
      // This catch block will handle errors thrown by the register function in AuthContext
      // or other errors during the submission process.
      console.error("Registration Page Error:", err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setPageLoading(false);
    }
  };

  // Disable form elements if either the page is submitting or AuthContext is in a loading state.
  const formDisabled = pageLoading || authLoading;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registrati</h2>
              {error && <AlertMessage type="danger" message={error} />}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={formDisabled}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={formDisabled}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={formDisabled}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="roleSelect" className="form-label">Ruolo</label>
                  <select
                    className="form-select"
                    id="roleSelect"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={formDisabled}
                  >
                    <option value="candidato">Candidato</option>
                    <option value="azienda">Azienda</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={formDisabled}>
                  {pageLoading ? 'Registrazione in corso...' : 'Registrati'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
