import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Laptop,
  HelpCircle,
} from 'lucide-react';
import { CategoryName, PaymentMethod } from '../types';

export interface CategoryMeta {
  name: CategoryName;
  icon: any;
  color: string;
  bgColor: string;
  darkBgColor: string;
  borderColor: string;
}

export const CATEGORIES: Record<CategoryName, CategoryMeta> = {
  Food: {
    name: 'Food',
    icon: Utensils,
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    darkBgColor: 'dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
  },
  Shopping: {
    name: 'Shopping',
    icon: ShoppingBag,
    color: '#EC4899',
    bgColor: 'bg-pink-50',
    darkBgColor: 'dark:bg-pink-950/40',
    borderColor: 'border-pink-200 dark:border-pink-800/40',
  },
  Transport: {
    name: 'Transport',
    icon: Car,
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800/40',
  },
  Bills: {
    name: 'Bills',
    icon: Receipt,
    color: '#EF4444',
    bgColor: 'bg-rose-50',
    darkBgColor: 'dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800/40',
  },
  Entertainment: {
    name: 'Entertainment',
    icon: Film,
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    darkBgColor: 'dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800/40',
  },
  Health: {
    name: 'Health',
    icon: HeartPulse,
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    darkBgColor: 'dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
  },
  Education: {
    name: 'Education',
    icon: GraduationCap,
    color: '#06B6D4',
    bgColor: 'bg-cyan-50',
    darkBgColor: 'dark:bg-cyan-950/40',
    borderColor: 'border-cyan-200 dark:border-cyan-800/40',
  },
  Salary: {
    name: 'Salary',
    icon: Briefcase,
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    darkBgColor: 'dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
  },
  Investment: {
    name: 'Investment',
    icon: TrendingUp,
    color: '#6366F1',
    bgColor: 'bg-indigo-50',
    darkBgColor: 'dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800/40',
  },
  Freelance: {
    name: 'Freelance',
    icon: Laptop,
    color: '#14B8A6',
    bgColor: 'bg-teal-50',
    darkBgColor: 'dark:bg-teal-950/40',
    borderColor: 'border-teal-200 dark:border-teal-800/40',
  },
  Other: {
    name: 'Other',
    icon: HelpCircle,
    color: '#64748B',
    bgColor: 'bg-slate-50',
    darkBgColor: 'dark:bg-slate-800/40',
    borderColor: 'border-slate-200 dark:border-slate-700/40',
  },
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI',
  'Bank Transfer',
  'Crypto',
  'Other',
];

export const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar ($)' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee (₹)' },
  { symbol: '€', code: 'EUR', name: 'Euro (€)' },
  { symbol: '£', code: 'GBP', name: 'British Pound (£)' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar (C$)' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar (A$)' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen (¥)' },
  { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham (AED)' },
  { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar (S$)' },
];

export function formatCurrency(amount: number, currency = '$'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}${currency}${formatted}`;
}
