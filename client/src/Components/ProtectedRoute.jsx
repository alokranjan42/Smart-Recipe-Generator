import React from 'react'
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">Loading...</p>
    </div>
  );

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
