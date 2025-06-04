// In Bacheca-annunci-di-lavoro-master/frontend/Bacheca/src/pages/LoginPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure bootstrap is imported

export default function LoginPage() {
  const { login, isAuthenticated, role, loading } = useAuth(); // Assuming login in AuthContext handles Google token
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'azienda') {
        navigate('/dashboard-azienda');
      } else if (role === 'candidato') {
        navigate('/dashboard-candidato');
      } else {
        navigate('/'); // Fallback
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    console.log("Google Login Success:", credentialResponse);
    // The credentialResponse object contains the JWT token from Google (credentialResponse.credential)
    // This token needs to be sent to your backend for verification and session creation.
    // The login function in AuthContext should be adapted or a new one created for this.
    try {
      // Assuming your AuthContext's login function is adapted to take the Google token
      // or you have a specific loginWithGoogle(token) function.
      // For now, we rely on the placeholder login in AuthContext to be updated.
      await login(credentialResponse.credential); // Pass the Google JWT token
    } catch (err) {
      console.error("Login Page Google Error:", err);
      setError(err.message || 'Failed to login with Google. Please try again.');
    }
  };

  const handleGoogleFailure = (errorResponse) => {
    console.error("Google Login Failure:", errorResponse);
    setError('Google login failed. Please try again.');
  };

  if (!googleClientId) {
    console.error("VITE_GOOGLE_CLIENT_ID is not defined in your .env file.");
    // It's good practice to inform the user if the configuration is missing.
    // However, returning null or a simple message might be too disruptive if the page has other login methods.
    // For now, the component will render, but Google Login button might show an error or not work.
    // The GoogleLogin component itself might handle the missing client_id gracefully or show an error.
    // The instructions ask for an alert, so let's implement that.
     return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="alert alert-danger text-center">
                        Google Client ID is not configured. <br/>
                        OAuth login cannot be initialized. <br/>
                        Please set <code>VITE_GOOGLE_CLIENT_ID</code> in your <code>.env</code> file.
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <p className="text-center">Logging in...</p>}

                <div className="d-grid">
                   <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      useOneTap
                      disabled={loading}
                    />
                </div>
                {/* You might add traditional email/password login form here later if needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
