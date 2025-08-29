import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHome, FiLogOut, FiLogIn } from "react-icons/fi";

export const Header: React.FC = () => {
  const auth = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };
  const getUserName = () => {
    return (
      auth.user?.profile?.name ||
      auth.user?.profile?.email?.split("@")[0] ||
      "User"
    );
  };
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white/5 bg-glass border-b border-white/10 sticky top-0 z-50 w-full">
      <div className="w-full flex justify-between items-center py-4 px-6">
        {/* Logo and App Name */}
        <Link
          to="/"
          className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
        >
          <div className="bg-white rounded-lg">
            <img
              src="/logo.png"
              alt="App Logo"
              className="w-10 h-10 rounded-lg"
            />
          </div>

          <span className="text-3xl font-light text-white">VoteWave</span>
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
              <div className="w-8 h-8 bg-white/5 bg-glass border border-white/10 rounded-xl flex items-center justify-center hover:border-white/20 transition-all duration-300">
                <span className="text-white font-semibold text-sm">
                  {getUserInitial()}
                </span>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                    <p className="text-sm font-medium text-white">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {auth.user?.profile.email}
                    </p>
                  </div>
                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <FiHome className="inline-block text-lg" /> Home
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        auth.removeUser();
                        signOutRedirect();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors flex items-center gap-2"
                    >
                      <FiLogOut className="inline-block text-lg" /> Sign Out
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
            className="bg-white/5 bg-glass border border-white/10 hover:border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3"
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <FiLogIn className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Sign In</span>
            </div>
          </motion.button>
        )}
      </div>
    </header>
  );
};
