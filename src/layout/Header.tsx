import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const auth = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const getUserName = () => {
    return auth.user?.profile?.email?.split('@')[0] || 'User';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 w-full">
      <div className="w-full flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-sm">🗳️</span>
          </motion.div>
          <span className="text-2xl font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Poll App
          </span>
        </Link>

        {/* User Controls */}
        {auth.isAuthenticated ? (
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-3 py-2 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{getUserInitial()}</span>
              </div>
              <span className="text-sm font-medium text-white/90 hidden sm:block">
                {getUserName()}
              </span>
              <motion.svg
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{getUserName()}</p>
                    <p className="text-xs text-gray-400 truncate">{auth.user?.profile.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      🏠 Home
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        auth.removeUser();
                        signOutRedirect();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click outside to close */}
            {showUserMenu && (
              <div
                className="fixed inset-0 z-[-1]"
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>
        ) : (
          <motion.button
            onClick={() => auth.signinRedirect()}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium px-4 py-2 rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        )}
      </div>
    </header>
  );
};
