import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Settings,
  Home,
  Users,
  Video,
  DollarSign,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Top Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.userType === 'admin';

  const adminNavItems = [
    { path: '/admin', label: 'لوحة التحكم', icon: Home },
    { path: '/admin/users', label: 'المستخدمين', icon: Users },
    { path: '/admin/videos', label: 'الفيديوهات', icon: Video },
    { path: '/admin/withdrawals', label: 'طلبات السحب', icon: DollarSign },
    { path: '/admin/settings', label: 'الإعدادات', icon: Settings },
  ];

  const userNavItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: Home },
    { path: '/tasks', label: 'المهمات', icon: Video },
    { path: '/withdrawal', label: 'سحب الارباح', icon: DollarSign },
    { path: '/notifications', label: 'الإشعارات', icon: Bell },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 ml-3 mr-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {isAdmin ? 'لوحة التحكم' : 'EarnWatch'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  <Icon className="w-4 h-4 ml-2" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* User balance (for regular users) */}
            {!isAdmin && user && (
              <div className="hidden ml-2 sm:flex items-center space-x-2 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {user.balance?.toLocaleString() || 0} دينار عراقي
                </span>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-2 pl-0 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                dir='ltr'
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>ملفي</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

// Bottom Navigation for Mobile (User only)
export const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  if (user?.userType === 'admin') return null;

  const navItems = [
    { path: '/dashboard', label: 'الرئيسية', icon: Home },
    { path: '/tasks', label: 'المهمات', icon: Video },
    { path: '/withdrawal', label: 'السحب', icon: DollarSign },
    { path: '/notifications', label: 'الإشعارات', icon: Bell },
    { path: '/profile', label: 'ملفي', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 ${isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
          aria-label="تبديل الثيم"
          type="button"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="text-xs font-medium select-none">الثيم</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;