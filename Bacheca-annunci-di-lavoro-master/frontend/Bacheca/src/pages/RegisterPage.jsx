// In Bacheca-annunci-di-lavoro-master/frontend/Bacheca/src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure bootstrap is imported, ideally globally in main.jsx or App.jsx

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidato'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoadingState] = useState(false); // Renamed to avoid conflict with AuthContext's loading

  const { register, isAuthenticated, role: userRole, loading: authLoading } = useAuth(); // Destructure loading as authLoading
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role after successful registration and authentication
      if (userRole === 'azienda') {
        navigate('/dashboard-azienda');
      } else if (userRole === 'candidato') {
        navigate('/dashboard-candidato');
      } else {
        navigate('/'); // Fallback, though role should be set
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingState(true);
    try {
      await register(name, email, password, role);
      // Navigation is handled by useEffect
    } catch (err) {
      // The register function in AuthContext should ideally throw an error or return a value indicating failure
      console.error("Registration Page Error:", err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

  // Use authLoading to disable form if AuthContext is busy (e.g. during token verification or existing operations)
  const formDisabled = loading || authLoading;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registrati</h2>
              {error && <div className="alert alert-danger">{error}</div>}
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
                  {loading ? 'Registrazione in corso...' : 'Registrati'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
