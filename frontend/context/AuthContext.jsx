// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { API_URL } from '../constants/urls';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/api/user/verify`);
        if (!cancelled) setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password
      });
      console.log({data});

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { data } = await axios.post(`${API_URL}/api/user/register`, userData);

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/user/profile`, userData);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};