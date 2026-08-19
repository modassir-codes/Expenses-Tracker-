import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  DollarSign,
  Database,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Lock,
  Sparkles,
  Server,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../lib/constants';
import { api } from '../lib/api';

interface SettingsViewProps {
  onRefresh: () => void;
  onOpenDocs: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefresh, onOpenDocs }) => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || '$');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget?.toString() || '3500');

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCurrency(user.currency || '$');
      setMonthlyBudget(user.monthlyBudget?.toString() || '3500');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        currency,
        monthlyBudget: parseFloat(monthlyBudget) || 3000,
      });
      setSuccessMessage('Profile and currency preferences updated successfully!');
      onRefresh();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (!confirm('Reset all ledger transactions, budgets, and savings goals back to the default portfolio dataset?')) return;

    setResetting(true);
    try {
      await api.resetDemoData();
      onRefresh();
      setSuccessMessage('Database reset to default realistic portfolio dataset!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to reset demo dataset');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage currency display, user identity, and storage configurations
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {successMessage}
        </div>
      )}

      {/* User Profile Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile & Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update personal info and primary display currency</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Primary Currency Symbol
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Monthly Budget Target ({currency})
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={monthlyBudget}
                onChange={e => setMonthlyBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Database & Infrastructure Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Database & Persistence Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Status of server data persistence layer</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active & Synchronized
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
          <p>
            The backend is running a resilient storage engine with full multi-user partition support. You can optionally supply your MongoDB Atlas URI in <code>.env</code> under <code>MONGODB_URI</code>.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenDocs}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              View MongoDB Setup Guide
            </button>

            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>Reset to Sample Dataset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
