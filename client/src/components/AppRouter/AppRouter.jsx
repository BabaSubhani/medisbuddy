import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../AuthForm/AuthForm';
import Dashboard from '../Dashboard/Dashboard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './AppRouter.css';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-router__loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="app-router">
      {isAuthenticated() ? <Dashboard /> : <AuthForm />}
    </div>
  );
};

export default AppRouter;