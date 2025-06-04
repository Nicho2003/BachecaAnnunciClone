/**
 * @file ProtectedRoute.jsx
 * @description Component to protect routes based on authentication status and user roles.
 * Redirects unauthenticated users to the login page.
 * Redirects authenticated users without required roles to a fallback page (e.g., home).
 * Renders child routes via <Outlet /> if access is permitted.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingIndicator from './LoadingIndicator'; // Import the new LoadingIndicator

// Example of a dedicated UnauthorizedPage (can be created as a separate component if needed)
// const UnauthorizedPage = () => (
//   <div className="container text-center py-5">
//     <h1>Access Denied</h1>
//     <p>You do not have the necessary permissions to view this page.</p>
//     <Link to="/" className="btn btn-primary">Go to Homepage</Link>
//   </div>
// );

/**
 * Protects routes by checking user authentication and roles.
 *
 * - If AuthContext is loading, displays a loading indicator.
 * - If user is not authenticated, redirects to `/login`, preserving the intended destination.
 * - If `allowedRoles` are specified and the user's role is not among them, redirects to `/` (home).
 *   (Alternatively, could redirect to a dedicated `/unauthorized` page).
 * - If authenticated and (no roles specified or user has a permitted role), renders the child routes (`<Outlet />`).
 *
 * @param {object} props - The component's props.
 * @param {Array<string>} [props.allowedRoles] - An array of roles allowed to access the route.
 *                                                If undefined or empty, only authentication is checked.
 * @returns {JSX.Element} The child component via <Outlet /> if access is allowed, or <Navigate> for redirection.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    // Display a loading indicator while auth state is being determined
    return <LoadingIndicator text="Verifica autenticazione in corso..." />;
  }

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    // state={{ from: location }} allows redirecting back to the originally requested page after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if allowedRoles is provided and has entries
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // User is authenticated but does not have the required role
      console.warn(`Access denied for role: "${role}". Allowed roles: "${allowedRoles.join(', ')}". Redirecting to home.`);
      // Redirect to home page or an "Unauthorized" page
      // return <Navigate to="/unauthorized" replace />;
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role (if specified), or no specific role is required for this route
  return <Outlet />; // Renders the nested child route component
}
