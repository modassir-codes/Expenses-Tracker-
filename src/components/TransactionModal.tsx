import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  DollarSign,
  Check,
} from 'lucide-react';
import { Transaction, TransactionType, CategoryName, PaymentMethod } from '../types';
import { CATEGORIES, PAYMENT_METHODS } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: any) => Promise<void>;
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transactionToEdit,
}) => {
  const { user } = useAuth();
  const currencySymbol = user?.currency || '$';

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryName>('Food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [notes, setNotes] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setDescription(transactionToEdit.description);
      setDate(transactionToEdit.date);
      setPaymentMethod(transactionToEdit.paymentMethod || 'Credit Card');
      setNotes(transactionToEdit.notes || '');
      setTags(transactionToEdit.tags || []);
    } else {
      setType('expense');
      setAmount('');
      setCategory('Food');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('Credit Card');
      setNotes('');
      setTags([]);
    }
    setError(null);
  }, [transactionToEdit, isOpen]);

  // Adjust default category based on type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income' && (category === 'Food' || category === 'Shopping' || category === 'Bills')) {
      setCategory('Salary');
    } else if (newType === 'expense' && (category === 'Salary' || category === 'Freelance' || category === 'Investment')) {
      setCategory('Food');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief description.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        type,
        amount: parsedAmount,
        category,
        description: description.trim(),
        date,
        paymentMethod,
        notes: notes.trim(),
        tags,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="transaction-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="transaction-modal-container"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                type === 'income'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              }`}
            >
              {transactionToEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {transactionToEdit ? 'Edit Transaction' : 'New Transaction'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {transactionToEdit ? 'Update your entry details' : 'Log a recent income or expenditure'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              - Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              + Income
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Amount ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-lg font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Groceries at Trader Joe's"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1">
              {Object.entries(CATEGORIES).map(([catKey, cat]) => {
                const Icon = cat.icon;
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey as CategoryName)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: cat.color }} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Client, Essential, Vacation"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes / Receipt memo
            </label>
            <textarea
              rows={2}
              placeholder="Additional details, invoice references, or notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-600/30"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {transactionToEdit ? 'Save Changes' : 'Record Transaction'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
