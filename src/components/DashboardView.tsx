import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  FileSpreadsheet,
  PieChart as PieIcon,
  Tag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DashboardStats, Transaction } from '../types';
import { CATEGORIES, formatCurrency } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onOpenNewTransaction: () => void;
  onOpenEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onOpenNewTransaction,
  onOpenEditTransaction,
  onDeleteTransaction,
  onNavigate,
}) => {
  const { user } = useAuth();
  const currencySymbol = user?.currency || '$';

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  // Budget Status & Color Computation
  const budgetSpentPct = stats.budgetSpentPercentage;
  let budgetBadgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let budgetBarColor = 'bg-emerald-500';
  let budgetStatusText = 'Budget is healthy & on track';

  if (budgetSpentPct >= 100) {
    budgetBadgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    budgetBarColor = 'bg-rose-500';
    budgetStatusText = `Exceeded budget by ${budgetSpentPct - 100}%!`;
  } else if (budgetSpentPct >= 85) {
    budgetBadgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    budgetBarColor = 'bg-amber-500';
    budgetStatusText = 'Approaching monthly budget threshold';
  }

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Welcome & Quick Actions Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Good day, {user?.name.split(' ')[0] || 'Modassir'} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Here is your current financial pulse. Net balance is healthy with a {stats.savingsRate}% monthly savings rate.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deep Analytics</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Net Balance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(stats.totalBalance, currencySymbol)}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> Cash Flow Positive
              </span>
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Income</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(stats.totalIncome, currencySymbol)}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              This month: +{formatCurrency(stats.monthlyIncome, currencySymbol)}
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              -{formatCurrency(stats.totalExpense, currencySymbol)}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              This month: -{formatCurrency(stats.monthlyExpense, currencySymbol)}
            </p>
          </div>
        </div>

        {/* Monthly Budget Progress Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Budget</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${budgetBadgeColor}`}>
              {budgetSpentPct}%
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(stats.monthlyExpense, currencySymbol)}
              <span className="text-xs font-normal text-slate-400"> / {formatCurrency(stats.monthlyBudget, currencySymbol)}</span>
            </h3>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${budgetBarColor}`}
                style={{ width: `${Math.min(budgetSpentPct, 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{budgetStatusText}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(stats.budgetRemaining, currencySymbol)} left
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Charts & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Monthly Cash Flow Comparison Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Income vs. Expense Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">6-Month Comparative Performance</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${currencySymbol}${v}`} />
                <Tooltip
                  formatter={(val: number) => [`${currencySymbol}${val.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spending Categories Widget */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Categories</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top Expenditure Allocations</p>
            </div>
            <button
              onClick={() => onNavigate('budgets')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              Budgets <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-60 pr-1">
            {stats.categoryBreakdown.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No expense categories logged for this month yet.
              </div>
            ) : (
              stats.categoryBreakdown.slice(0, 5).map(cat => {
                const meta = CATEGORIES[cat.category] || CATEGORIES.Other;
                const Icon = meta.icon;
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(cat.amount, currencySymbol)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-normal">({cat.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List with Quick Action Triggers */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest entries logged across accounts</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>View All ({stats.transactionCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No transactions recorded yet. Click "New Transaction" to add your first entry!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-3 pl-2">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 hidden sm:table-cell">Date</th>
                  <th className="pb-3 hidden md:table-cell">Payment</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {stats.recentTransactions.map(tx => {
                  const isIncome = tx.type === 'income';
                  const catMeta = CATEGORIES[tx.category] || CATEGORIES.Other;
                  const Icon = catMeta.icon;

                  return (
                    <tr
                      key={tx.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {tx.description}
                            </p>
                            {tx.notes && (
                              <p className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-3 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                        {tx.date}
                      </td>

                      <td className="py-3 hidden md:table-cell text-slate-500 dark:text-slate-400">
                        {tx.paymentMethod || 'Card'}
                      </td>

                      <td className="py-3 text-right">
                        <span
                          className={`font-bold ${
                            isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currencySymbol)}
                        </span>
                      </td>

                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => onOpenEditTransaction(tx)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
