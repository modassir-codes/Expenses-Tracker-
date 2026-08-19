import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardStats, BudgetConfig, SavingsGoal, CategoryName } from '../types';
import { CATEGORIES, formatCurrency } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface BudgetViewProps {
  stats: DashboardStats | null;
  refreshTrigger: number;
  onRefresh: () => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  stats,
  refreshTrigger,
  onRefresh,
}) => {
  const { user } = useAuth();
  const currencySymbol = user?.currency || '$';

  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig | null>(null);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit budget modal state
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editMonthlyBudget, setEditMonthlyBudget] = useState('3500');
  const [editCategoryBudgets, setEditCategoryBudgets] = useState<Record<string, number>>({});
  const [savingBudget, setSavingBudget] = useState(false);

  // Goal modal state
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCurrent, setNewGoalCurrent] = useState('0');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);

  // Add deposit to goal modal state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [savingDeposit, setSavingDeposit] = useState(false);

  const loadBudgetData = async () => {
    setLoading(true);
    try {
      const [budgets, goalsRes] = await Promise.all([
        api.getBudgets(),
        api.getSavingsGoals(),
      ]);
      setBudgetConfig(budgets);
      setSavingsGoals(goalsRes.goals || []);
      setEditMonthlyBudget(budgets.monthlyBudget.toString());
      setEditCategoryBudgets(budgets.categoryBudgets || {});
    } catch (err) {
      console.error('Failed to load budgets & goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, [refreshTrigger]);

  const handleSaveBudgetConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBudget(true);
    try {
      await api.updateBudgets({
        monthlyBudget: parseFloat(editMonthlyBudget) || 3000,
        categoryBudgets: editCategoryBudgets,
      });
      setBudgetModalOpen(false);
      onRefresh();
      loadBudgetData();
    } catch (err) {
      console.error('Failed to update budgets:', err);
    } finally {
      setSavingBudget(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTarget) return;

    setSavingGoal(true);
    try {
      await api.createSavingsGoal({
        title: newGoalTitle.trim(),
        targetAmount: parseFloat(newGoalTarget),
        currentAmount: parseFloat(newGoalCurrent) || 0,
        targetDate: newGoalDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
      setGoalModalOpen(false);
      setNewGoalTitle('');
      setNewGoalTarget('');
      setNewGoalCurrent('0');
      loadBudgetData();
    } catch (err) {
      console.error('Failed to create goal:', err);
    } finally {
      setSavingGoal(false);
    }
  };

  const handleDepositToGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount) return;

    const added = parseFloat(depositAmount);
    if (isNaN(added) || added <= 0) return;

    const newAmount = selectedGoal.currentAmount + added;
    setSavingDeposit(true);
    try {
      await api.updateSavingsGoal(selectedGoal.id, {
        currentAmount: newAmount,
      });

      if (newAmount >= selectedGoal.targetAmount) {
        // Trigger celebratory confetti!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setDepositModalOpen(false);
      setSelectedGoal(null);
      setDepositAmount('');
      loadBudgetData();
    } catch (err) {
      console.error('Failed to update deposit:', err);
    } finally {
      setSavingDeposit(false);
    }
  };

  // Compute category budget status by comparing actual monthly spend with category limit
  const categorySpendingMap: Record<string, number> = {};
  if (stats) {
    stats.categoryBreakdown.forEach(c => {
      categorySpendingMap[c.category] = c.amount;
    });
  }

  return (
    <div id="budget-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Budgets & Financial Targets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set smart spending thresholds, monitor warnings, and track milestones
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Configure Limits</span>
          </button>

          <button
            onClick={() => setGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Savings Goal</span>
          </button>
        </div>
      </div>

      {/* Overall Monthly Target Hero Banner */}
      {stats && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Monthly Master Ceiling
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatCurrency(stats.monthlyExpense, currencySymbol)}{' '}
                <span className="text-base font-normal text-slate-400">
                  / {formatCurrency(stats.monthlyBudget, currencySymbol)}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stats.budgetRemaining > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✨ You have {formatCurrency(stats.budgetRemaining, currencySymbol)} remaining to spend safely this month.
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    ⚠️ You have exceeded your target monthly ceiling by {formatCurrency(stats.monthlyExpense - stats.monthlyBudget, currencySymbol)}.
                  </span>
                )}
              </p>
            </div>

            {/* Circular / Linear Gauge indicator */}
            <div className="w-full md:w-80 space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Ceiling Utilization</span>
                <span className={stats.budgetSpentPercentage >= 90 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  {stats.budgetSpentPercentage}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    stats.budgetSpentPercentage >= 100
                      ? 'bg-rose-500'
                      : stats.budgetSpentPercentage >= 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(stats.budgetSpentPercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>0%</span>
                <span>Threshold: 80%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Budgets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Category Spending Limits & Real-Time Alerts
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Updated automatically from transactions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetConfig &&
            Object.entries(budgetConfig.categoryBudgets || {}).map(([catName, rawLimit]) => {
              const limitNum = Number(rawLimit) || 0;
              const spent = categorySpendingMap[catName] || 0;
              const pct = limitNum > 0 ? Math.round((spent / limitNum) * 100) : 0;
              const catMeta = CATEGORIES[catName as CategoryName] || CATEGORIES.Other;
              const Icon = catMeta.icon;

              const isExceeded = pct >= 100;
              const isWarning = pct >= 80 && pct < 100;

              return (
                <div
                  key={catName}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{catName}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isExceeded
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(spent, currencySymbol)}
                      </span>
                      <span className="text-slate-400">Limit: {formatCurrency(limitNum, currencySymbol)}</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    {isExceeded ? (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Over budget by {formatCurrency(spent - limitNum, currencySymbol)}
                      </span>
                    ) : isWarning ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Warning: {formatCurrency(limitNum - spent, currencySymbol)} left
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {formatCurrency(limitNum - spent, currencySymbol)} left
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Savings Goals Milestones Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Target Savings Goals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track progress toward major milestones and celebrate completions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savingsGoals.length === 0 ? (
            <div className="col-span-3 p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No savings goals created yet. Click "New Savings Goal" to track a target!
            </div>
          ) : (
            savingsGoals.map(goal => {
              const pct = goal.targetAmount > 0 ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) : 0;
              const isAchieved = goal.currentAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {goal.category || 'Savings'}
                      </span>
                      {isAchieved && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Goal Achieved!
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {goal.title}
                    </h4>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-900 dark:text-white">
                          {formatCurrency(goal.currentAmount, currencySymbol)}
                        </span>
                        <span className="text-slate-400">
                          Target: {formatCurrency(goal.targetAmount, currencySymbol)}
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Target: {goal.targetDate}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setDepositModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      + Add Funds
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Budgets Configuration Modal */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configure Budget Ceilings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set your overall monthly ceiling and per-category spending targets
            </p>

            <form onSubmit={handleSaveBudgetConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overall Monthly Budget Ceiling ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={editMonthlyBudget}
                  onChange={e => setEditMonthlyBudget(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category Limits ({currencySymbol})
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
                  {Object.keys(CATEGORIES).map(cat => (
                    <div key={cat} className="space-y-1">
                      <span className="text-[11px] text-slate-500 font-medium">{cat}</span>
                      <input
                        type="number"
                        min="0"
                        step="25"
                        placeholder="Limit"
                        value={editCategoryBudgets[cat] || ''}
                        onChange={e =>
                          setEditCategoryBudgets({
                            ...editCategoryBudgets,
                            [cat]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBudget}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {savingBudget ? 'Saving...' : 'Save Limits'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Savings Milestone</h3>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vacation to Tokyo, Japan"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="3000"
                    value={newGoalTarget}
                    onChange={e => setNewGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Saved ({currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={newGoalCurrent}
                    onChange={e => setNewGoalCurrent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={newGoalDate}
                  onChange={e => setNewGoalDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGoal}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {savingGoal ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {depositModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Funds to Goal</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contributing toward <strong>{selectedGoal.title}</strong>
            </p>

            <form onSubmit={handleDepositToGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deposit Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="250"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-base font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDeposit}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {savingDeposit ? 'Depositing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
