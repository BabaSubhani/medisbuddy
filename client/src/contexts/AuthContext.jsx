import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('medsbuddy_token');
    const savedUser = localStorage.getItem('medsbuddy_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('medsbuddy_token', userToken);
    localStorage.setItem('medsbuddy_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medsbuddy_token');
    localStorage.removeItem('medsbuddy_user');
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isPatient = () => {
    return user?.role === 'patient';
  };

  const isCaretaker = () => {
    return user?.role === 'caretaker';
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isPatient,
    isCaretaker,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};