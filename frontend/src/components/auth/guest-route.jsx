// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return user? <Navigate to="/" replace />: children;

};

export default GuestRoute;