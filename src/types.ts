export type TransactionType = 'income' | 'expense';

export type CategoryName =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Salary'
  | 'Investment'
  | 'Freelance'
  | 'Other';

export type PaymentMethod =
  | 'Credit Card'
  | 'Debit Card'
  | 'Cash'
  | 'UPI'
  | 'Bank Transfer'
  | 'Crypto'
  | 'Other';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: CategoryName;
  description: string;
  date: string; // ISO format: YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string; // e.g. '$', '₹', '€', '£'
  monthlyBudget: number;
  avatar?: string;
  createdAt: string;
}

export interface CategoryBudget {
  category: CategoryName;
  limit: number;
}

export interface BudgetConfig {
  userId: string;
  monthlyBudget: number;
  categoryBudgets: Record<string, number>;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  color?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBudget: number;
  budgetSpentPercentage: number;
  budgetRemaining: number;
  savingsRate: number;
  transactionCount: number;
  recentTransactions: Transaction[];
  categoryBreakdown: {
    category: CategoryName;
    amount: number;
    percentage: number;
    count: number;
    color: string;
  }[];
  monthlyTrend: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
  dailyTrend: {
    date: string;
    day: string;
    amount: number;
  }[];
}

export interface TransactionFilters {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: 'all' | CategoryName;
  paymentMethod: 'all' | PaymentMethod;
  startDate: string;
  endDate: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  page: number;
  limit: number;
}
