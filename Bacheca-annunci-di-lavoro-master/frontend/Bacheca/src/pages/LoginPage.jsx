/**
 * @file LoginPage.jsx
 * @description Page for user login, primarily using Google OAuth.
 * Handles Google login success and failure, and redirects authenticated users.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import AlertMessage from '../components/AlertMessage'; // Import AlertMessage
// LoadingIndicator could be used if there was a non-auth-blocking page load activity.
// For authLoading, it often replaces the whole page or form area.

/**
 * Renders the Login Page.
 * Provides Google OAuth login functionality.
 * Redirects users if they are already authenticated.
 * Displays errors related to login or Google Client ID configuration.
 * @returns {JSX.Element} The LoginPage component.
 */
export default function LoginPage() {
  const { login, isAuthenticated, role, loading: authLoading } = useAuth(); // Renamed loading from context
  const navigate = useNavigate();
  /** @state {string} error - Stores error messages related to login attempts. */
  const [error, setError] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  /**
   * Effect to redirect already authenticated users to their respective dashboards or home page.
   * Runs when `isAuthenticated`, `role`, or `navigate` changes.
   */
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'azienda') {
        navigate('/dashboard-azienda');
      } else if (role === 'candidato') {
        navigate('/dashboard-candidato');
      } else {
        navigate('/'); // Fallback redirect
      }
    }
  }, [isAuthenticated, role, navigate]);

  /**
   * Handles successful Google login.
   * Calls the `login` function from AuthContext with the Google credential.
   * @param {object} credentialResponse - The response object from Google, containing the credential token.
   * @async
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    setError(''); // Clear previous errors
    console.log("Google Login Success:", credentialResponse);
    try {
      // The login function in AuthContext is expected to handle the Google token
      // by sending it to the backend for verification and session creation.
      // TODO: Ensure AuthContext.login is fully implemented for Google tokens.
      await login(credentialResponse.credential);
    } catch (err) {
      console.error("Login Page Google Error:", err);
      setError(err.message || 'Failed to login with Google. Please try again.');
    }
  };

  /**
   * Handles failed Google login attempts.
   * @param {object} errorResponse - The error object or response from Google.
   */
  const handleGoogleFailure = (errorResponse) => {
    console.error("Google Login Failure:", errorResponse);
    setError('Google login failed. Please try again.');
  };

  // Display an error message if Google Client ID is not configured
  if (!googleClientId) {
    console.error("VITE_GOOGLE_CLIENT_ID is not defined in .env file.");
     return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8"> {/* Wider column for potentially longer message */}
                    <AlertMessage
                        type="danger"
                        message={<>Google Client ID is not configured. <br/>OAuth login cannot be initialized. <br/>Please set <code>VITE_GOOGLE_CLIENT_ID</code> in your <code>.env</code> file.</>}
                        className="text-center"
                    />
                </div>
            </div>
        </div>
    );
  }

  // Note: GoogleOAuthProvider should ideally be higher up in the component tree (e.g., in main.jsx or App.jsx)
  // if Google login is used in multiple places or if useGoogleLogin hook is utilized elsewhere.
  // For a single login button on one page, placing it here is acceptable.
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Login</h2>
                {error && <AlertMessage type="danger" message={error} />}
                {authLoading && <p className="text-center">Verifying authentication...</p>}

                <div className="d-grid">
                   <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      useOneTap // Enables One Tap login experience
                      disabled={authLoading} // Disable button if auth operation is in progress
                    />
                </div>
                {/* TODO: Add traditional email/password login form here later if needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
