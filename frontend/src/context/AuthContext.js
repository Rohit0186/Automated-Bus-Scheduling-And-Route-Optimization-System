import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, refreshToken, username: userMsg, role } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ username: userMsg, role }));
      
      setUser({ username: userMsg, role });
      toast.success(`Welcome back, ${userMsg}!`);
      return res.data;
    } catch (err) {
      if (!err.response) {
        toast.error('❌ Cannot connect to server. Make sure backend is running.');
      } else {
        toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
      throw err;
    }
  };

  const register = async (userData, inviteCode = '') => {
    try {
      const url = inviteCode ? `/auth/register?inviteCode=${inviteCode}` : '/auth/register';
      const res = await api.post(url, userData);
      toast.success('Registration successful! You can now login.');
      return res.data;
    } catch (err) {
      if (!err.response) {
        toast.error('❌ Cannot connect to server. Make sure backend is running.');
      } else {
        toast.error(err.response?.data?.message || 'Registration failed. Username or email may already exist.');
      }
      throw err;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const res = await api.post('/auth/refresh', { refreshToken });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      return res.data.accessToken;
    } catch (err) {
      logout();
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out safely.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
