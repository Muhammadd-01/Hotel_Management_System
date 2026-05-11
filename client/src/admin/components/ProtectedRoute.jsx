// ProtectedRoute.jsx - yeh component sirf logged-in users ko page dikhata hai
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// agar user logged in nahi hai to login page pe bhejo
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // jab tak loading ho raha hai, spinner dikhao
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // agar authenticated nahi hai to login pe redirect karo
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // authenticated hai to children render karo
  return children;
};

export default ProtectedRoute;
