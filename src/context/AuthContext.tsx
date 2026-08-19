import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; currency?: string; monthlyBudget?: number }) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Auth token invalid or expired, falling back to demo user:', err);
      // Fallback demo user to ensure instant, uninterrupted testing
      try {
        const demoRes = await api.demoLogin();
        setAuthToken(demoRes.token);
        setUser(demoRes.user);
      } catch (e) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      refreshUser();
    } else {
      // Auto-load demo user initially for portfolio reviewers
      api.demoLogin().then(res => {
        setAuthToken(res.token);
        setUser(res.user);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, pass);
      setAuthToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; currency?: string; monthlyBudget?: number }) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setAuthToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.demoLogin();
      setAuthToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    if (res && res.user) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
