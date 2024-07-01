// src/stores/authStore.ts
import create from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/login", {
            email,
            password,
          });
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
        } catch (error) {
          set({ error: "Invalid credentials", isLoading: false });
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/auth/signup", {
            name,
            email,
            password,
          });
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
        } catch (error) {
          set({ error: "Signup failed", isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete axios.defaults.headers.common["Authorization"];
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
