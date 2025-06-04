// In Bacheca-annunci-di-lavoro-master/frontend/Bacheca/src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
// We will need axios for API calls later, can be imported when needed
// import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // Example: load token
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role')); // Example: load role
  const [loading, setLoading] = useState(false); // Set to true if you have an effect to verify token

  // Placeholder login function - ADAPTED to take a single credential argument
  // This credential could be a Google token string, or an object {email, password} for traditional login (not yet fully supported here)
  const login = async (credential) => {
    setLoading(true);
    // Simulate API call
    if (typeof credential === 'string') {
      console.log("Attempting login with Google token:", credential);
      // Backend would verify this token and return user info + session token
    } else {
      // This part is for a potential traditional email/password login
      // console.log("Attempting login with email/password:", credential.email);
    }
    // Replace with actual API call using axios:
    // If Google token:
    // try {
    //   const response = await axios.post('/api/auth/google-login', { token: credential });
    //   const { token: apiToken, user: userData } = response.data;
    //   localStorage.setItem('token', apiToken);
    //   localStorage.setItem('role', userData.role);
    //   setUser(userData);
    //   setToken(apiToken);
    //   setRole(userData.role);
    //   setIsAuthenticated(true);
    // } catch (error) { ... }
    //
    // If email/password:
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
    //   setIsAuthenticated(false);
    //   setToken(null);
    //   setUser(null);
    //   setRole(null);
    //   // Handle error
    //   throw error; // Re-throw error to be caught by UI
    // } finally {
    //   setLoading(false);
    // }
    // For now, simulate success for structure
    setTimeout(() => {
      // Simulate user data based on type of credential for more realistic placeholder
      let mockUser, mockRole;
      if (typeof credential === 'string') { // Assume Google login if it's a string token
        mockUser = { name: 'Google User', email: 'google.user@example.com', source: 'google' };
        mockRole = 'candidato'; // Or determine from backend response
      } else { // Placeholder for potential email/password
        mockUser = { name: 'Test User', email: credential.email, source: 'form' };
        mockRole = 'azienda'; // Or determine from backend response
      }

      const mockToken = 'fake-jwt-token';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('role', mockRole);
      setUser(mockUser);
      setToken(mockToken);
      setRole(mockRole);
      setIsAuthenticated(true);
      setLoading(false);
    }, 1000);
  };

  // Placeholder register function
  const register = async (name, email, password, userRole) => {
    setLoading(true);
    console.log("Attempting registration for:", name, email, userRole);
    // Replace with actual API call using axios:
    // try {
    //   const response = await axios.post('/api/auth/register', { name, email, password, role: userRole });
    //   const { token: apiToken, user: userData } = response.data;
    //   localStorage.setItem('token', apiToken);
    //   localStorage.setItem('role', userData.role);
    //   setUser(userData);
    //   setToken(apiToken);
    //   setRole(userData.role);
    //   setIsAuthenticated(true);
    //   // Redirect or handle as per app flow
    // } catch (error) {
    //   console.error("Registration failed", error);
    //   // Handle error
    // } finally {
    //   setLoading(false);
    // }
    // For now, simulate success
     setTimeout(() => {
      const mockUser = { name, email, role: userRole };
      const mockToken = 'fake-jwt-token-registered';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('role', mockUser.role);
      setUser(mockUser);
      setToken(mockToken);
      setRole(mockUser.role);
      setIsAuthenticated(true);
      setLoading(false);
    }, 1000);
  };

  // Logout function
  const logout = () => {
    setLoading(true);
    // Add backend call to /api/auth/logout if it exists and is needed
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user'); // If storing user object
    setUser(null);
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    setLoading(false);
    // Redirect to home or login page, handled by calling component or route
    console.log("User logged out");
  };

  // Optional: Effect to verify token on app load (example)
  // useEffect(() => {
  //   const verifyToken = async () => {
  //     if (token) {
  //       setLoading(true);
  //       try {
  //         // const response = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  //         // setUser(response.data.user);
  //         // setRole(response.data.user.role);
  //         // setIsAuthenticated(true);
  //         // For now, if token exists, assume it's valid for placeholder
  //         console.log("Token exists, assuming valid for now without backend verification step.");
  //         // If you store user details in localStorage, parse them here
  //         const storedUser = localStorage.getItem('user');
  //         if (storedUser) setUser(JSON.parse(storedUser));

  //       } catch (error) {
  //         console.error("Token verification failed or token expired", error);
  //         logout(); // Clear invalid token
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //        setLoading(false); // No token, not loading
  //     }
  //   };
  //   verifyToken();
  // }, [token]);


  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, role, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
