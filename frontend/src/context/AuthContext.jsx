import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ethereal_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ethereal_user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      localStorage.removeItem('ethereal_user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err; // re-throw so callers can catch and show errors
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
      setLoading(false);
      // If server returned a token, user was auto-verified — log them in directly
      if (data.token) {
        setUser(data);
        return { success: true, autoVerified: true };
      }
      return { success: true, email: data.email };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, { email, otp });
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'OTP Verification failed');
      return { success: false, error: err.response?.data?.message || 'OTP Verification failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const resendOtp = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, { email });
      setLoading(false);
      // "Account verified successfully." means user was auto-verified
      const autoVerified = data.message && data.message.toLowerCase().includes('verified successfully');
      return { success: true, message: data.message, autoVerified };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to resend OTP');
      return { success: false, error: err.response?.data?.message || 'Failed to resend OTP' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      verifyOtp,
      resendOtp,
      logout,
      isAdmin: user?.isAdmin || false,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
