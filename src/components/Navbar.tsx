import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Moon,
  Sun,
  BookOpen,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CURRENCIES } from '../lib/constants';

interface NavbarProps {
  onOpenNewTransaction: () => void;
  onOpenAuth: () => void;
  onOpenDocs: () => void;
  onOpenProfile: () => void;
  activeView: string;
  setActiveView: (v: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTransaction,
  onOpenAuth,
  onOpenDocs,
  onOpenProfile,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                AuraSpend
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <Sparkles className="w-3 h-3" /> Pro SaaS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Financial Intelligence & Budgeting
            </p>
          </div>
        </div>

        {/* Middle Date & Stats preview (desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
          <span>📅 Today: {currentDate}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live Real-Time Sync</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Transaction */}
          <button
            id="nav-add-transaction-btn"
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Transaction</span>
            <span className="xs:hidden">Add</span>
          </button>

          {/* Setup / Docs Guide Button */}
          <button
            id="nav-docs-btn"
            onClick={onOpenDocs}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Portfolio Guide & Setup Instructions"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight max-w-[100px] truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {user.currency} Currency
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3" /> Portfolio Demo Session
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Account & Budget Settings
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenDocs();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Setup & MongoDB Guide
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
