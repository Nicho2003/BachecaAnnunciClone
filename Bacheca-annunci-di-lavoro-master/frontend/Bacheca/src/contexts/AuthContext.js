/**
 * @file AuthContext.js
 * @description Provides authentication context for the application.
 * Manages user state, authentication status, token, role, and provides login, logout, register functions.
 */
import { createContext, useContext, useState, useEffect } from 'react';
// We will need axios for API calls later
// import axios from 'axios';

/**
 * Authentication Context.
 * Stores user authentication details and provides authentication functions.
 * @type {React.Context<null|object>}
 */
const AuthContext = createContext(null);

/**
 * Provides authentication state and functions to its children components.
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
  /** @state {null|object} user - The currently authenticated user object. Null if not authenticated. */
  const [user, setUser] = useState(null);
  /** @state {null|string} token - The JWT authentication token. Null if not authenticated. */
  const [token, setToken] = useState(localStorage.getItem('token'));
  /** @state {boolean} isAuthenticated - True if the user is authenticated, false otherwise. */
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initialize as false until checked
  /** @state {null|string} role - The role of the authenticated user (e.g., 'candidato', 'azienda'). */
  const [role, setRole] = useState(null); // Initialize as null
  /** @state {boolean} loading - True if an authentication operation (login, register, token verification) is in progress. */
  const [loading, setLoading] = useState(true); // Set to true initially for initial auth check

  // Placeholder login function - ADAPTED to take a single credential argument
  // This credential could be a Google token string, or an object {email, password} for traditional login
  /**
   * Logs in a user.
   * For Google login, credential is the Google token.
   * For traditional login (not fully implemented), credential would be an object {email, password}.
   * @param {string|object} credential - The user's credential (Google token or email/password object).
   * @async
   */
  const login = async (credential) => {
    setLoading(true);
    // TODO: Replace with actual API call
    // Simulate API call
    if (typeof credential === 'string') {
      console.log("Attempting login with Google token:", credential);
      // Backend would verify this token and return user info + session token
    } else {
      // This part is for a potential traditional email/password login
      // console.log("Attempting login with email/password:", credential.email);
    }
    // Example for Google token:
    // try {
    //   const response = await axios.post('/api/auth/google-login', { token: credential });
    //   const { token: apiToken, user: userData } = response.data; // Assuming backend returns token and user object
    //   localStorage.setItem('token', apiToken);
    //   localStorage.setItem('role', userData.role); // Assuming role is part of user object
    //   setUser(userData);
    //   setToken(apiToken);
    //   setRole(userData.role);
    //   setIsAuthenticated(true);
    // } catch (error) {
    //   console.error("Login failed", error);
    //   // Clear any partial state
    //   setUser(null); setToken(null); setRole(null); setIsAuthenticated(false);
    //   throw error; // Re-throw to be caught by UI
    // }
    //
    // Example for email/password:
    // try {
    //   const response = await axios.post('/api/auth/login', { email: credential.email, password: credential.password });
    //   const { token: apiToken, user: userData } = response.data;
    //   localStorage.setItem('token', apiToken);
    //   localStorage.setItem('role', userData.role);
    //   setUser(userData);
    //   setToken(apiToken);
    //   setRole(userData.role);
    //   setIsAuthenticated(true);
    // } catch (error) {
    //   console.error("Login failed", error);
    //   setUser(null); setToken(null); setRole(null); setIsAuthenticated(false);
    //   throw error;
    // } finally {
    //   setLoading(false); // Ensure loading is false in a finally block for real calls
    // }
    // Mock response with potential failure
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate failure for a specific Google token or email
        if (credential === 'failGoogleToken' || (typeof credential === 'object' && credential.email === 'fail@example.com')) {
          console.warn('Mock login forcing failure for:', credential);
          setUser(null); setToken(null); setRole(null); setIsAuthenticated(false); // Clear state on failure
          setLoading(false);
          reject({ message: 'Mock Login Error: Invalid credentials or token.' });
        } else {
          let mockUser, mockRoleFromLogin;
          if (typeof credential === 'string') { // Assume Google login
            mockUser = { _id: 'google123', name: 'Google User', email: 'google.user@example.com', source: 'google' };
            mockRoleFromLogin = 'candidato';
          } else { // Assume email/password
            mockUser = { _id: 'formUser123', name: 'Test User', email: credential.email, source: 'form' };
            mockRoleFromLogin = 'azienda';
          }

          const mockToken = 'fake-jwt-token-logged-in';
          localStorage.setItem('token', mockToken);
          localStorage.setItem('role', mockRoleFromLogin);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          setToken(mockToken);
          setRole(mockRoleFromLogin);
          setIsAuthenticated(true);
          setLoading(false);
          resolve({ user: mockUser, token: mockToken }); // Resolve with some data
        }
      }, 1000);
    });
  };

  /**
   * Registers a new user.
   * @param {string} name - The user's full name.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's chosen password.
   * @param {string} userRole - The user's chosen role ('candidato' or 'azienda').
   * @async
   */
  const register = async (name, email, password, userRole) => {
    setLoading(true);
    console.log("Attempting registration for:", name, email, userRole);
    // TODO: Replace with actual API call
    // try {
    //   const response = await axios.post('/api/auth/register', { name, email, password, role: userRole });
    //   const { token: apiToken, user: userData } = response.data;
    //   localStorage.setItem('token', apiToken);
    //   localStorage.setItem('role', userData.role);
    //   localStorage.setItem('user', JSON.stringify(userData)); // Persist user object
    //   setUser(userData);
    //   setToken(apiToken);
    //   setRole(userData.role);
    //   setIsAuthenticated(true);
    // } catch (error) {
    //   console.error("Registration failed", error);
    //   setUser(null); setToken(null); setRole(null); setIsAuthenticated(false);
    //   throw error;
    // } finally {
    //   setLoading(false); // Ensure loading is false in a finally block for real calls
    // }
    // Mock response with potential failure
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'failreg@example.com') {
          console.warn('Mock register forcing failure for email:', email);
          setUser(null); setToken(null); setRole(null); setIsAuthenticated(false); // Clear state on failure
          setLoading(false);
          reject({ message: 'Mock Registration Error: This email is blacklisted.' });
        } else {
          const mockUser = { _id: `newUser-${Date.now()}`, name, email, role: userRole };
          const mockToken = 'fake-jwt-token-registered';
          localStorage.setItem('token', mockToken);
          localStorage.setItem('role', mockUser.role);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          setToken(mockToken);
          setRole(mockUser.role);
          setIsAuthenticated(true);
          setLoading(false);
          resolve({ user: mockUser, token: mockToken }); // Resolve with some data
        }
      }, 1000);
    });
  };

  /**
   * Logs out the current user.
   * Clears authentication state and removes token/user details from localStorage.
   */
  const logout = () => {
    // setLoading(true); // Optional: if logout involved an async backend call
    // TODO: Add backend call to /api/auth/logout if it exists and is needed for session invalidation
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    // setLoading(false); // Optional
    console.log("User logged out");
  };

  // Effect to load user from localStorage on initial app load and verify token (simulated)
  useEffect(() => {
    const attemptLoadSession = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');

      if (storedToken && storedUser && storedRole) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setRole(storedRole);
          setIsAuthenticated(true);
          // TODO: Add a real token verification step with the backend here.
          // If token is invalid/expired, call logout() and then setLoading(false).
          console.log("AuthContext: Session loaded from localStorage.");
        } catch (error) {
          console.error("AuthContext: Failed to parse stored user data, clearing session.", error);
          logout(); // Clears corrupted data and sets isAuthenticated to false
        }
      } else {
        console.log("AuthContext: No session found in localStorage.");
        // Ensure states are cleared if no session is found
        setUser(null);
        setToken(null);
        setRole(null);
        setIsAuthenticated(false);
      }
      setLoading(false); // Finished initial loading/verification attempt
    };

    attemptLoadSession();
  }, []); // Empty dependency array ensures this runs once on mount


  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, role, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to easily consume the AuthContext.
 * @returns {object} The authentication context value (user, token, isAuthenticated, role, loading, login, logout, register).
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
