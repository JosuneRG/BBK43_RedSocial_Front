// src/routes/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
