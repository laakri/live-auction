import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  balance: number;
  reputation: number;
  rank: string;
  isVerified: boolean;
  freeAuctionsRemaining: number;
  createdAuctions: string[];
  wonAuctions: string[];
  preferences: {
    notifications: boolean;
    privateProfile: boolean;
  };
  xp: number;
  level: number;
  achievements: string[];
  virtualCurrencyBalance: number;
  alliance?: string;
  customizations: {
    theme: string;
    avatar: string;
  };
  loyaltyTier: string;
  referralCode: string;
  referredBy?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, toast: any) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    toast: any
  ) => Promise<void>;
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

      login: async (email: string, password: string, toast: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:3000/api/users/login",
            {
              email,
              password,
            }
          );
          console.log(response.data.user);

          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Login failed",
          });
          set({ error: "Invalid credentials", isLoading: false });
        }
      },

      signup: async (
        username: string,
        email: string,
        password: string,
        toast: any
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:3000/api/users/register",
            {
              username,
              email,
              password,
            }
          );
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          toast({
            title: "SignUp Succeed",
            description: "Signup completed successfully",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Signup failed",
          });
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
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
