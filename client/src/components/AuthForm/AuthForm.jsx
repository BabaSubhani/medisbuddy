import React, { useState } from 'react';
import { Mail, Lock, User, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import BASE_URL from '../../config/api';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient',
  });

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.role) newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.user, data.token);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'patient',
    });
  };

  return (
    <div className="auth-form">
      <div className="auth-form__container">
        <div className="auth-form__header">
          <div className="auth-form__logo">
            <UserCheck className="auth-form__logo-icon" />
            <h1 className="auth-form__title">MedsBuddy</h1>
          </div>
          <p className="auth-form__subtitle">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <form className="auth-form__form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-form__field">
              <label className="auth-form__label">
                <User className="auth-form__icon" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`auth-form__input ${errors.name ? 'auth-form__input--error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="auth-form__error">{errors.name}</span>}
            </div>
          )}

          <div className="auth-form__field">
            <label className="auth-form__label">
              <Mail className="auth-form__icon" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="auth-form__error">{errors.email}</span>}
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label">
              <Lock className="auth-form__icon" />
              Password
            </label>
            <div className="auth-form__password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="auth-form__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <span className="auth-form__error">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="auth-form__field">
              <label className="auth-form__label">
                <UserCheck className="auth-form__icon" />
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`auth-form__input ${errors.role ? 'auth-form__input--error' : ''}`}
              >
                <option value="patient">Patient</option>
                <option value="caretaker">Caretaker</option>
              </select>
              {errors.role && <span className="auth-form__error">{errors.role}</span>}
            </div>
          )}

          {errors.general && (
            <div className="auth-form__error auth-form__error--general">
              {errors.general}
            </div>
          )}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-form__footer">
          <p className="auth-form__switch-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" className="auth-form__switch-button" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
