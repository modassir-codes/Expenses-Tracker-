import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  ArrowUpDown,
  FileSpreadsheet,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Transaction, TransactionType, CategoryName, PaymentMethod } from '../types';
import { CATEGORIES, PAYMENT_METHODS, formatCurrency } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface TransactionsViewProps {
  onOpenNewTransaction: () => void;
  onOpenEditTransaction: (tx: Transaction) => void;
  refreshTrigger: number;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenNewTransaction,
  onOpenEditTransaction,
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const currencySymbol = user?.currency || '$';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CategoryName>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentMethod>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // CSV Import state
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: '15',
        sortBy,
      };

      if (search.trim()) params.search = search.trim();
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (paymentFilter !== 'all') params.paymentMethod = paymentFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.getTransactions(params);
      setTransactions(res.transactions);
      setTotalCount(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, typeFilter, categoryFilter, paymentFilter, sortBy, startDate, endDate, refreshTrigger]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await api.deleteTransaction(deletingId);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      fetchTransactions();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/transactions/export/csv', '_blank');
  };

  const handleCsvImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setCsvImporting(true);
    try {
      const lines = csvText.trim().split('\n');
      const items = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        if (i === 0 && line.toLowerCase().includes('amount')) continue; // Skip header

        // Basic CSV splitting (supporting simple quoted values)
        const parts = line.split(',').map(s => s.replace(/^["']|["']$/g, '').trim());
        if (parts.length >= 3) {
          const date = parts[0] || new Date().toISOString().slice(0, 10);
          const type = parts[1]?.toLowerCase() === 'income' ? 'income' : 'expense';
          const category = parts[2] || 'Other';
          const description = parts[3] || 'CSV Import';
          const amount = parseFloat(parts[4] || '0');

          if (!isNaN(amount) && amount > 0) {
            items.push({
              date,
              type,
              category,
              description,
              amount,
              paymentMethod: parts[5] || 'Other',
              notes: parts[6] || '',
            });
          }
        }
      }

      if (items.length === 0) {
        throw new Error('No valid transaction rows found in pasted text.');
      }

      const res = await api.bulkImportTransactions(items);
      setCsvSuccessMessage(`Successfully imported ${res.count} transactions!`);
      setCsvText('');
      setTimeout(() => {
        setCsvModalOpen(false);
        setCsvSuccessMessage(null);
        fetchTransactions();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Import failed');
    } finally {
      setCsvImporting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setPaymentFilter('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date_desc');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    paymentFilter !== 'all' ||
    startDate ||
    endDate;

  return (
    <div id="transactions-view" className="space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transactions Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search, filter, categorize, and export your personal ledger ({totalCount} total entries)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Download CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search description, tags, notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={e => {
                setTypeFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Types (Income & Expense)</option>
              <option value="income">Income Only (+)</option>
              <option value="expense">Expense Only (-)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Date Range & Reset Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date Range:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading ledger records...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Transactions Found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No entries match your current search or filter criteria. Try adjusting filters or create a new transaction.
              </p>
            </div>
            <button
              onClick={onOpenNewTransaction}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Transaction
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="pb-3 pl-2">Transaction</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 hidden sm:table-cell">Date</th>
                    <th className="pb-3 hidden md:table-cell">Method</th>
                    <th className="pb-3 hidden lg:table-cell">Tags</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {transactions.map(tx => {
                    const isIncome = tx.type === 'income';
                    const catMeta = CATEGORIES[tx.category] || CATEGORIES.Other;
                    const Icon = catMeta.icon;

                    return (
                      <tr
                        key={tx.id}
                        className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Title & Notes */}
                        <td className="py-3 pl-2 max-w-xs">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isIncome
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {tx.description}
                              </p>
                              {tx.notes && (
                                <p className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category badge */}
                        <td className="py-3">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
                            style={{
                              backgroundColor: `${catMeta.color}15`,
                              borderColor: `${catMeta.color}30`,
                              color: catMeta.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catMeta.color }} />
                            {tx.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3 hidden sm:table-cell text-slate-600 dark:text-slate-300">
                          {tx.date}
                        </td>

                        {/* Payment Method */}
                        <td className="py-3 hidden md:table-cell text-slate-500 dark:text-slate-400">
                          {tx.paymentMethod || 'Credit Card'}
                        </td>

                        {/* Tags */}
                        <td className="py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-[140px]">
                            {tx.tags && tx.tags.length > 0 ? (
                              tx.tags.map(t => (
                                <span
                                  key={t}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                >
                                  #{t}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3 text-right">
                          <span
                            className={`font-bold text-sm ${
                              isIncome
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currencySymbol)}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 text-right pr-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onOpenEditTransaction(tx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingId(tx.id);
                                setDeleteConfirmOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <p className="text-slate-500 dark:text-slate-400">
                  Showing page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span> ({totalCount} entries)
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Transaction?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this record? This action will update your account balances accordingly.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Import CSV Data</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste CSV rows formatted as: Date,Type,Category,Description,Amount,Method
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCsvModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ×
              </button>
            </div>

            {csvSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {csvSuccessMessage}
              </div>
            )}

            <form onSubmit={handleCsvImportSubmit} className="space-y-3">
              <textarea
                rows={6}
                required
                placeholder="2026-08-15,expense,Food,Supermarket Dinner,54.50,Credit Card&#10;2026-08-16,income,Freelance,UI Design Project,400.00,UPI"
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCsvModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={csvImporting}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {csvImporting ? 'Importing...' : 'Parse & Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
