// src/hooks/useAuth.ts
import { useEffect } from "react";
import useAuthStore from "../stores/authStore";
import axios from "axios";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  } = useAuthStore();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
   // error,
    login,
    signup,
    logout,
    //clearError,
  };
};
