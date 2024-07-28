import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-200"></div>
        <span>Loading</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/AuthPage" />;
};

export default ProtectedRoute;
