// ProtectedRoute.jsx - Ensures only authenticated users can access specific pages
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Gatekeeper component to verify session and user roles before rendering children
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Display a loading state while authentication status is being determined
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verifying Credentials...</p>
      </div>
    );
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if the user's role is not authorized for this specific route
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected component if all checks pass
  return children;
};

export default ProtectedRoute;
