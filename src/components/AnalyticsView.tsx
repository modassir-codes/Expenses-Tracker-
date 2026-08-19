import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  Flame,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardStats } from '../types';
import { CATEGORIES, formatCurrency } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

interface AnalyticsViewProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, loading }) => {
  const { user } = useAuth();
  const currencySymbol = user?.currency || '$';
  const [selectedChartTime, setSelectedChartTime] = useState<'6m' | '3m' | 'all'>('6m');

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  // Calculate high level financial analytics
  const avgDailySpend = stats.monthlyExpense > 0 ? (stats.monthlyExpense / 30).toFixed(2) : '0.00';
  const topCategory = stats.categoryBreakdown[0] || null;
  const netSavings = Math.max(0, stats.monthlyIncome - stats.monthlyExpense);

  const pieData = stats.categoryBreakdown.map(c => ({
    name: c.category,
    value: c.amount,
    color: c.color,
    percentage: c.percentage,
  }));

  return (
    <div id="analytics-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics & Financial Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Deep dive into income streams, expenditure velocity, and category allocations
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['6m', '3m', 'all'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedChartTime(period)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedChartTime === period
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {period === '6m' ? 'Last 6 Months' : period === '3m' ? 'Last Quarter' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Savings Rate Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Savings Retention Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.savingsRate}%</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{formatCurrency(netSavings, currencySymbol)}</span> retained this month
            </p>
          </div>
        </div>

        {/* Avg Daily Burn */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Daily Expenditure</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(Number(avgDailySpend), currencySymbol)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Based on 30-day active rolling average
            </p>
          </div>
        </div>

        {/* Primary Outflow Pillar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Largest Expense Driver</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {topCategory ? topCategory.category : 'N/A'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {topCategory ? `${formatCurrency(topCategory.amount, currencySymbol)} (${topCategory.percentage}% of outflow)` : 'No data recorded'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Cumulative Area Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Cash Flow Growth</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Net Surplus / Deficit Curve</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Positive Net
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut / Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Category Allocation Spectrum</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share of Total Outflow</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">No expense records available for pie chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${formatCurrency(val, currencySymbol)}`,
                      `${name}`,
                    ]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-[11px] text-slate-600 dark:text-slate-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Spending Velocity Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent 7-Day Spending Velocity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Day-by-day expenditure activity</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Tracking</span>
          </div>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${currencySymbol}${v}`} />
              <Tooltip
                formatter={(val: number) => [`${formatCurrency(val, currencySymbol)}`, 'Spent']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
