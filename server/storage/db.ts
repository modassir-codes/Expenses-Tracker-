import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  currency: string;
  monthlyBudget: number;
  avatar?: string;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalRecord {
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

export interface DatabaseSchema {
  users: UserRecord[];
  transactions: TransactionRecord[];
  categoryBudgets: Record<string, Record<string, number>>; // userId -> { Category: limit }
  savingsGoals: SavingsGoalRecord[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'expense_tracker_db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Could not create .data directory', err);
  }
}

// Helper to generate IDs
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Initial demo data generator
function getInitialSeedData(): DatabaseSchema {
  const defaultUserId = 'usr_modassir_demo';
  const now = new Date();
  
  // Format dates relative to current date for realistic charts
  const formatIsoDate = (yearOffset = 0, monthOffset = 0, day = 15): string => {
    const d = new Date(now.getFullYear() + yearOffset, now.getMonth() + monthOffset, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const demoUser: UserRecord = {
    id: defaultUserId,
    name: 'Modassir Raja',
    email: 'modassir@example.com',
    passwordHash: 'demo123', // Demo password
    currency: '$',
    monthlyBudget: 3500,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const demoTransactions: TransactionRecord[] = [
    // Current Month Income
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 4500,
      type: 'income',
      category: 'Salary',
      description: 'Senior Software Engineer Monthly Salary',
      date: formatIsoDate(0, 0, 1),
      paymentMethod: 'Bank Transfer',
      tags: ['Primary', 'Employment'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 850,
      type: 'income',
      category: 'Freelance',
      description: 'Full Stack React & Node Dashboard Development',
      date: formatIsoDate(0, 0, 8),
      paymentMethod: 'UPI',
      tags: ['Client Project', 'WebDev'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 220,
      type: 'income',
      category: 'Investment',
      description: 'Quarterly Stock Dividends & Yield',
      date: formatIsoDate(0, 0, 12),
      paymentMethod: 'Bank Transfer',
      tags: ['Passive Income'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // Current Month Expenses
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 1100,
      type: 'expense',
      category: 'Bills',
      description: 'Apartment Rent & High-speed Fiber Internet',
      date: formatIsoDate(0, 0, 2),
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly essential fixed overhead',
      tags: ['Housing', 'Fixed'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 145.5,
      type: 'expense',
      category: 'Food',
      description: 'Organic Groceries & Weekly Meal Prep',
      date: formatIsoDate(0, 0, 4),
      paymentMethod: 'Credit Card',
      tags: ['Groceries', 'Healthy'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 42.8,
      type: 'expense',
      category: 'Food',
      description: 'Italian Bistro Dinner with Friends',
      date: formatIsoDate(0, 0, 7),
      paymentMethod: 'Credit Card',
      tags: ['Dining Out'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 29.99,
      type: 'expense',
      category: 'Entertainment',
      description: 'Netflix, Spotify & Cloud Server Subscriptions',
      date: formatIsoDate(0, 0, 9),
      paymentMethod: 'Debit Card',
      tags: ['Digital', 'Streaming'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 85,
      type: 'expense',
      category: 'Transport',
      description: 'Metro Pass & Uber Rides',
      date: formatIsoDate(0, 0, 11),
      paymentMethod: 'Debit Card',
      tags: ['Commute'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 189,
      type: 'expense',
      category: 'Shopping',
      description: 'Ergonomic Mechanical Keyboard & Desk Mat',
      date: formatIsoDate(0, 0, 13),
      paymentMethod: 'Credit Card',
      tags: ['Tech Setup', 'Hardware'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 65,
      type: 'expense',
      category: 'Health',
      description: 'Monthly Gym Membership & Protein Supplements',
      date: formatIsoDate(0, 0, 15),
      paymentMethod: 'Credit Card',
      tags: ['Fitness'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 99,
      type: 'expense',
      category: 'Education',
      description: 'Advanced Cloud Architecture & TypeScript Course',
      date: formatIsoDate(0, 0, 17),
      paymentMethod: 'Credit Card',
      tags: ['Skill Growth', 'Portfolio'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // Last Month Transactions
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 4500,
      type: 'income',
      category: 'Salary',
      description: 'Senior Software Engineer Monthly Salary',
      date: formatIsoDate(0, -1, 1),
      paymentMethod: 'Bank Transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 600,
      type: 'income',
      category: 'Freelance',
      description: 'Mobile App API Architecture Consulting',
      date: formatIsoDate(0, -1, 14),
      paymentMethod: 'UPI',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 1100,
      type: 'expense',
      category: 'Bills',
      description: 'Apartment Rent & Utilities',
      date: formatIsoDate(0, -1, 2),
      paymentMethod: 'Bank Transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 410,
      type: 'expense',
      category: 'Food',
      description: 'Supermarket Groceries & Dinners',
      date: formatIsoDate(0, -1, 10),
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 240,
      type: 'expense',
      category: 'Shopping',
      description: 'Casual Summer Wardrobe & Sneakers',
      date: formatIsoDate(0, -1, 18),
      paymentMethod: 'Debit Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 130,
      type: 'expense',
      category: 'Transport',
      description: 'Fuel & City Parking',
      date: formatIsoDate(0, -1, 22),
      paymentMethod: 'Debit Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // 2 Months Ago
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 4500,
      type: 'income',
      category: 'Salary',
      description: 'Software Engineer Monthly Salary',
      date: formatIsoDate(0, -2, 1),
      paymentMethod: 'Bank Transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 1100,
      type: 'expense',
      category: 'Bills',
      description: 'Apartment Rent & Electricity',
      date: formatIsoDate(0, -2, 2),
      paymentMethod: 'Bank Transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 380,
      type: 'expense',
      category: 'Food',
      description: 'Monthly Food & Groceries',
      date: formatIsoDate(0, -2, 12),
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('tx'),
      userId: defaultUserId,
      amount: 120,
      type: 'expense',
      category: 'Entertainment',
      description: 'Concert Tickets & Weekend Outing',
      date: formatIsoDate(0, -2, 20),
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const demoCategoryBudgets: Record<string, Record<string, number>> = {
    [defaultUserId]: {
      Bills: 1200,
      Food: 600,
      Shopping: 350,
      Transport: 200,
      Entertainment: 150,
      Health: 150,
      Education: 200,
      Other: 200,
    },
  };

  const demoSavingsGoals: SavingsGoalRecord[] = [
    {
      id: generateId('goal'),
      userId: defaultUserId,
      title: 'Emergency Rainy Day Fund (6 Months)',
      targetAmount: 15000,
      currentAmount: 11200,
      targetDate: formatIsoDate(1, 0, 1),
      category: 'Emergency',
      color: '#10B981',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId('goal'),
      userId: defaultUserId,
      title: 'M3 Max MacBook Pro Developer Setup',
      targetAmount: 3200,
      currentAmount: 2800,
      targetDate: formatIsoDate(0, 2, 1),
      category: 'Tech Hardware',
      color: '#6366F1',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId('goal'),
      userId: defaultUserId,
      title: 'International Developer Conference Trip',
      targetAmount: 2500,
      currentAmount: 1650,
      targetDate: formatIsoDate(0, 6, 1),
      category: 'Travel',
      color: '#F59E0B',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    users: [demoUser],
    transactions: demoTransactions,
    categoryBudgets: demoCategoryBudgets,
    savingsGoals: demoSavingsGoals,
  };
}

class DatabaseEngine {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = getInitialSeedData();
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.transactions)) {
          this.data = parsed;
          this.isLoaded = true;
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing defaults:', err);
    }

    // Default initialization
    this.data = getInitialSeedData();
    this.saveToDisk();
    this.isLoaded = true;
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to disk:', err);
    }
  }

  public resetToDemo(userId: string) {
    const seed = getInitialSeedData();
    const targetUser = this.data.users.find(u => u.id === userId) || seed.users[0];
    
    // Replace transactions for this user
    this.data.transactions = this.data.transactions.filter(t => t.userId !== userId);
    const demoTxs = seed.transactions.map(t => ({ ...t, id: generateId('tx'), userId }));
    this.data.transactions.push(...demoTxs);
    
    this.data.categoryBudgets[userId] = seed.categoryBudgets[seed.users[0].id] || {};
    this.data.savingsGoals = this.data.savingsGoals.filter(g => g.userId !== userId);
    const demoGoals = seed.savingsGoals.map(g => ({ ...g, id: generateId('goal'), userId }));
    this.data.savingsGoals.push(...demoGoals);

    if (targetUser) {
      targetUser.monthlyBudget = 3500;
    }

    this.saveToDisk();
  }

  // --- User Operations ---
  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    currency?: string;
    monthlyBudget?: number;
  }): UserRecord {
    const newUser: UserRecord = {
      id: generateId('usr'),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      currency: userData.currency || '$',
      monthlyBudget: userData.monthlyBudget || 3000,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);

    // Give new user starting category budgets
    this.data.categoryBudgets[newUser.id] = {
      Food: 500,
      Bills: 1000,
      Shopping: 300,
      Transport: 150,
      Entertainment: 150,
      Health: 100,
      Education: 150,
      Other: 150,
    };

    // Seed sample transactions so new user explores UI seamlessly
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    
    this.data.transactions.push(
      {
        id: generateId('tx'),
        userId: newUser.id,
        amount: 3500,
        type: 'income',
        category: 'Salary',
        description: 'Initial Opening Account Balance & Salary',
        date: `${yyyy}-${mm}-01`,
        paymentMethod: 'Bank Transfer',
        tags: ['Welcome'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId('tx'),
        userId: newUser.id,
        amount: 85,
        type: 'expense',
        category: 'Food',
        description: 'Welcome Grocery Essentials',
        date: `${yyyy}-${mm}-05`,
        paymentMethod: 'Debit Card',
        tags: ['Groceries'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    this.saveToDisk();
    return newUser;
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<{
      name: string;
      email: string;
      currency: string;
      monthlyBudget: number;
      avatar: string;
    }>
  ): UserRecord | null {
    const user = this.findUserById(userId);
    if (!user) return null;

    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email.toLowerCase();
    if (updates.currency !== undefined) user.currency = updates.currency;
    if (updates.monthlyBudget !== undefined) user.monthlyBudget = Number(updates.monthlyBudget);
    if (updates.avatar !== undefined) user.avatar = updates.avatar;

    this.saveToDisk();
    return user;
  }

  // --- Transactions Operations ---
  public getTransactions(
    userId: string,
    filters?: {
      search?: string;
      type?: string;
      category?: string;
      paymentMethod?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
    }
  ): TransactionRecord[] {
    let list = this.data.transactions.filter(t => t.userId === userId);

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        list = list.filter(t => t.type === filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        list = list.filter(t => t.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        list = list.filter(t => t.paymentMethod === filters.paymentMethod);
      }
      if (filters.startDate) {
        list = list.filter(t => t.date >= filters.startDate!);
      }
      if (filters.endDate) {
        list = list.filter(t => t.date <= filters.endDate!);
      }
      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          t =>
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            (t.notes && t.notes.toLowerCase().includes(q)) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
        );
      }

      // Sorting
      const sortBy = filters.sortBy || 'date_desc';
      if (sortBy === 'date_desc') {
        list.sort((a, b) => (b.date === a.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)));
      } else if (sortBy === 'date_asc') {
        list.sort((a, b) => (a.date === b.date ? a.createdAt.localeCompare(b.createdAt) : a.date.localeCompare(b.date)));
      } else if (sortBy === 'amount_desc') {
        list.sort((a, b) => b.amount - a.amount);
      } else if (sortBy === 'amount_asc') {
        list.sort((a, b) => a.amount - b.amount);
      }
    } else {
      list.sort((a, b) => (b.date === a.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)));
    }

    return list;
  }

  public getTransactionById(userId: string, id: string): TransactionRecord | undefined {
    return this.data.transactions.find(t => t.id === id && t.userId === userId);
  }

  public createTransaction(
    userId: string,
    data: {
      amount: number;
      type: 'income' | 'expense';
      category: string;
      description: string;
      date: string;
      paymentMethod?: string;
      notes?: string;
      tags?: string[];
    }
  ): TransactionRecord {
    const tx: TransactionRecord = {
      id: generateId('tx'),
      userId,
      amount: Math.abs(Number(data.amount)),
      type: data.type,
      category: data.category || 'Other',
      description: data.description || 'Untitled Transaction',
      date: data.date || new Date().toISOString().slice(0, 10),
      paymentMethod: data.paymentMethod || 'Credit Card',
      notes: data.notes || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.transactions.unshift(tx);
    this.saveToDisk();
    return tx;
  }

  public updateTransaction(
    userId: string,
    id: string,
    data: Partial<TransactionRecord>
  ): TransactionRecord | null {
    const index = this.data.transactions.findIndex(t => t.id === id && t.userId === userId);
    if (index === -1) return null;

    const existing = this.data.transactions[index];
    const updated: TransactionRecord = {
      ...existing,
      ...data,
      amount: data.amount !== undefined ? Math.abs(Number(data.amount)) : existing.amount,
      updatedAt: new Date().toISOString(),
    };

    this.data.transactions[index] = updated;
    this.saveToDisk();
    return updated;
  }

  public deleteTransaction(userId: string, id: string): boolean {
    const initialLen = this.data.transactions.length;
    this.data.transactions = this.data.transactions.filter(t => !(t.id === id && t.userId === userId));
    const deleted = this.data.transactions.length < initialLen;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // --- Budgets ---
  public getBudgets(userId: string) {
    const user = this.findUserById(userId);
    const categoryBudgets = this.data.categoryBudgets[userId] || {};
    return {
      monthlyBudget: user?.monthlyBudget || 3000,
      categoryBudgets,
    };
  }

  public updateBudgets(userId: string, monthlyBudget?: number, categoryBudgets?: Record<string, number>) {
    const user = this.findUserById(userId);
    if (user && monthlyBudget !== undefined) {
      user.monthlyBudget = Number(monthlyBudget);
    }
    if (categoryBudgets !== undefined) {
      this.data.categoryBudgets[userId] = {
        ...(this.data.categoryBudgets[userId] || {}),
        ...categoryBudgets,
      };
    }
    this.saveToDisk();
    return this.getBudgets(userId);
  }

  // --- Savings Goals ---
  public getSavingsGoals(userId: string): SavingsGoalRecord[] {
    return this.data.savingsGoals.filter(g => g.userId === userId);
  }

  public createSavingsGoal(
    userId: string,
    data: {
      title: string;
      targetAmount: number;
      currentAmount?: number;
      targetDate: string;
      category?: string;
      color?: string;
    }
  ): SavingsGoalRecord {
    const goal: SavingsGoalRecord = {
      id: generateId('goal'),
      userId,
      title: data.title,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
      targetDate: data.targetDate,
      category: data.category || 'General',
      color: data.color || '#10B981',
      createdAt: new Date().toISOString(),
    };
    this.data.savingsGoals.push(goal);
    this.saveToDisk();
    return goal;
  }

  public updateSavingsGoal(
    userId: string,
    goalId: string,
    updates: Partial<SavingsGoalRecord>
  ): SavingsGoalRecord | null {
    const index = this.data.savingsGoals.findIndex(g => g.id === goalId && g.userId === userId);
    if (index === -1) return null;
    const existing = this.data.savingsGoals[index];
    const updated = { ...existing, ...updates };
    this.data.savingsGoals[index] = updated;
    this.saveToDisk();
    return updated;
  }

  public deleteSavingsGoal(userId: string, goalId: string): boolean {
    const initLen = this.data.savingsGoals.length;
    this.data.savingsGoals = this.data.savingsGoals.filter(g => !(g.id === goalId && g.userId === userId));
    const deleted = this.data.savingsGoals.length < initLen;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // --- Analytics & Statistics Calculations ---
  public getDashboardStats(userId: string) {
    const user = this.findUserById(userId);
    const transactions = this.getTransactions(userId);
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    const categoryMap: Record<string, { amount: number; count: number }> = {};
    const monthlyMap: Record<string, { income: number; expense: number }> = {};
    const dailyMap: Record<string, number> = {};

    // Initialize past 6 months in trend map
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('en-US', { month: 'short' });
      monthlyMap[ym] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const amt = Number(t.amount);
      const isCurrentMonth = t.date.startsWith(currentYearMonth);
      const ym = t.date.slice(0, 7);

      if (t.type === 'income') {
        totalIncome += amt;
        if (isCurrentMonth) monthlyIncome += amt;
        if (monthlyMap[ym]) monthlyMap[ym].income += amt;
      } else {
        totalExpense += amt;
        if (isCurrentMonth) {
          monthlyExpense += amt;
          // Aggregate category
          if (!categoryMap[t.category]) {
            categoryMap[t.category] = { amount: 0, count: 0 };
          }
          categoryMap[t.category].amount += amt;
          categoryMap[t.category].count += 1;

          // Aggregate daily
          dailyMap[t.date] = (dailyMap[t.date] || 0) + amt;
        }
        if (monthlyMap[ym]) monthlyMap[ym].expense += amt;
      }
    });

    const totalBalance = totalIncome - totalExpense;
    const monthlyBudget = user?.monthlyBudget || 3500;
    const budgetSpentPercentage = monthlyBudget > 0 ? Math.min(Math.round((monthlyExpense / monthlyBudget) * 100), 200) : 0;
    const budgetRemaining = Math.max(0, monthlyBudget - monthlyExpense);
    const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)) : 0;

    // Category breakdown colors mapping
    const categoryColors: Record<string, string> = {
      Food: '#F59E0B',
      Shopping: '#EC4899',
      Transport: '#3B82F6',
      Bills: '#EF4444',
      Entertainment: '#8B5CF6',
      Health: '#10B981',
      Education: '#06B6D4',
      Salary: '#10B981',
      Investment: '#6366F1',
      Freelance: '#14B8A6',
      Other: '#64748B',
    };

    const categoryBreakdown = Object.entries(categoryMap).map(([category, info]) => ({
      category: category as any,
      amount: Math.round(info.amount * 100) / 100,
      percentage: monthlyExpense > 0 ? Math.round((info.amount / monthlyExpense) * 100) : 0,
      count: info.count,
      color: categoryColors[category] || '#64748B',
    })).sort((a, b) => b.amount - a.amount);

    const monthlyTrend = Object.entries(monthlyMap).map(([ym, vals]) => {
      const [year, month] = ym.split('-');
      const dateObj = new Date(Number(year), Number(month) - 1, 1);
      return {
        month: dateObj.toLocaleString('en-US', { month: 'short' }),
        income: vals.income,
        expense: vals.expense,
        net: vals.income - vals.expense,
      };
    });

    // Last 7 days trend
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const iso = d.toISOString().slice(0, 10);
      dailyTrend.push({
        date: iso,
        day: d.toLocaleString('en-US', { weekday: 'short' }),
        amount: dailyMap[iso] || 0,
      });
    }

    return {
      totalBalance: Math.round(totalBalance * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpense: Math.round(monthlyExpense * 100) / 100,
      monthlyBudget,
      budgetSpentPercentage,
      budgetRemaining: Math.round(budgetRemaining * 100) / 100,
      savingsRate,
      transactionCount: transactions.length,
      recentTransactions: transactions.slice(0, 7),
      categoryBreakdown,
      monthlyTrend,
      dailyTrend,
    };
  }
}

export const db = new DatabaseEngine();
