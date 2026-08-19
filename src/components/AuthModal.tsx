import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../lib/constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, demoLogin } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('$');
  const [monthlyBudget, setMonthlyBudget] = useState('3500');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          currency,
          monthlyBudget: Number(monthlyBudget) || 3000,
        });
      } else {
        await login(email.trim(), password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize demo login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all my-8"
      >
        {/* Top Gradient Ribbon */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                AS
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRegister ? 'Create Your Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isRegister ? 'Start tracking your spending & budget' : 'Access your financial intelligence dashboard'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Login Option for Portfolio Reviewers */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Portfolio Quick Access</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">1-Click prefilled developer demo account</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Demo Login
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="px-6">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modassir Raja"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="modassir@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Budget
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={monthlyBudget}
                  onChange={e => setMonthlyBudget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isRegister ? 'Create My Account' : 'Sign In to Dashboard'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {isRegister ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
