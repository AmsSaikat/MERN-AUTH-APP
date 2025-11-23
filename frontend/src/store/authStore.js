import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  message: null,
  loading: false,

  emailForVerification: null, // for OTP or verification flows

  // ----------------------------------------------------------
  // SIMPLE SETTERS
  // ----------------------------------------------------------
  setError: (error) => set({ error }),
  setMessage: (message) => set({ message }),
  setEmailForVerification: (email) => set({ emailForVerification: email }),

  // ----------------------------------------------------------
  // CHECK AUTH
  // ----------------------------------------------------------
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/check-auth`);
      set({
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return null;
    }
  },

  // ----------------------------------------------------------
  // SIGNUP
  // ----------------------------------------------------------
signup: async (email, password, name) => {
  try {
    set({ error: null, message: null });

    const res = await axios.post(`${API_URL}/signup`, {
      email,
      password,
      name,
    });

    // Store email for OTP
    set({ emailForVerification: email });

    // Return something clear for the page
    return { success: true, message: res.data.message };
  } catch (err) {
    set({
      error: err.response?.data?.message || "Signup failed",
    });
    throw err;
  }
},


  // ----------------------------------------------------------
  // VERIFY EMAIL
  // ----------------------------------------------------------
  verifyEmail: async (email, otp) => {
    try {
      set({ error: null, message: null });
      const res = await axios.post(`${API_URL}/verify-email`, { email, code: otp });
      set({
        message: res.data.message,
        user: res.data.user,
        isAuthenticated: true,
        emailForVerification: null,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Verification failed",
      });
      throw err;
    }
  },

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  login: async (email, password) => {
    try {
      set({ error: null, message: null });
      const res = await axios.post(`${API_URL}/login`, { email, password });

      if (res.data.success) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          message: res.data.message,
        });
      }

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        message: null,
      });
      throw err;
    }
  },

  // ----------------------------------------------------------
  // FORGOT PASSWORD
  // ----------------------------------------------------------
  forgotPassword: async (email) => {
    try {
      set({ error: null, message: null });
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: res.data.message });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to send reset link",
      });
      throw err;
    }
  },

  // ----------------------------------------------------------
  // RESET PASSWORD
  // ----------------------------------------------------------
  resetPassword: async (token, password) => {
    try {
      set({ error: null, message: null });
      const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: res.data.message });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Reset failed",
      });
      throw err;
    }
  },

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, message: null });
    } catch (err) {
      console.log("Logout error:", err);
    }
  },
}));
