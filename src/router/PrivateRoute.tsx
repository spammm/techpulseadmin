import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute: React.FC<{ allowedRoles: string[] }> = ({
  allowedRoles,
}) => {
  const token = localStorage.getItem('token');

  if (!token || token === 'undefined') {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode<{ role: string; exp: number }>(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      console.warn('Token has expired');
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }

    if (allowedRoles.includes(decodedToken.role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export { PrivateRoute };
