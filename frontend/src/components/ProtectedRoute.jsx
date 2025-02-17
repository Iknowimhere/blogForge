import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Check if route requires specific roles
  if (roles && ! roles.includes(user.role)) {
    // Redirect non-admin users to home
    return <Navigate to="/" replace />;
  }

  // For admin users trying to access non-admin pages
  if (user.role === 'admin' && window.location.pathname === '/') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;