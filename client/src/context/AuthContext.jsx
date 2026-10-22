import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sc_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session on mount
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('sc_token');
      const savedUserStr = localStorage.getItem('sc_user');

      if (savedToken && savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          // Re-fetch latest user profile details
          const res = await authApi.getProfile(parsedUser.userId);
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('sc_user', JSON.stringify(res.user));
          }
        } catch {
          // If token expired or invalid, reset session
          localStorage.removeItem('sc_token');
          localStorage.removeItem('sc_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    if (res?.token && res?.user) {
      localStorage.setItem('sc_token', res.token);
      localStorage.setItem('sc_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Invalid response from login server');
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authApi.register(userData);
    if (res?.token && res?.user) {
      localStorage.setItem('sc_token', res.token);
      localStorage.setItem('sc_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Registration failed to return user session');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Stateless logout completed with warning:', e);
    } finally {
      localStorage.removeItem('sc_token');
      localStorage.removeItem('sc_user');
      setUser(null);
      setToken(null);
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    const res = await authApi.updateProfile({ ...profileData, userId: user?.userId });
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem('sc_user', JSON.stringify(res.user));
      return res.user;
    }
    return null;
  }, [user]);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    isAdopter: user?.role === 'Adopter',
    isShelterWorker: user?.role === 'ShelterWorker',
    isVolunteer: user?.role === 'Volunteer',
    loading,
    login,
    register,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
