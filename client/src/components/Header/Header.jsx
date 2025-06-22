import React from 'react';
import { LogOut, Moon, Sun, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <UserCheck className="header__logo-icon" />
          <span className="header__logo-text">MedsBuddy</span>
        </div>

        <div className="header__user-info">
          <span className="header__username">Welcome, {user?.name}</span>
          <span className="header__role">{user?.role}</span>
        </div>

        <div className="header__actions">
          <button
            className="header__theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </button>

          <button
            className="header__logout"
            onClick={logout}
            title="Logout"
          >
            <LogOut />
            <span className="header__logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;