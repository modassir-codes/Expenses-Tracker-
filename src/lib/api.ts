import { Transaction, DashboardStats, BudgetConfig, SavingsGoal } from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('auraspend_token') || 'user_usr_modassir_demo';
}

export function setAuthToken(token: string) {
  localStorage.setItem('auraspend_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('auraspend_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMsg = `Request failed with status ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.error) errMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    return request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: { name: string; email: string; password: string; currency?: string; monthlyBudget?: number }) {
    return request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async demoLogin() {
    return request<{ token: string; user: any }>('/auth/demo-login', {
      method: 'POST',
    });
  },

  async getCurrentUser() {
    return request<{ user: any }>('/auth/me');
  },

  async updateProfile(updates: Partial<{ name: string; email: string; currency: string; monthlyBudget: number; avatar: string }>) {
    return request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async resetDemoData() {
    return request<{ success: boolean; message: string }>('/auth/reset-demo', {
      method: 'POST',
    });
  },

  // Transactions
  async getTransactions(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ transactions: Transaction[]; total: number; page: number; totalPages: number }>(`/transactions${query}`);
  },

  async getTransaction(id: string) {
    return request<{ transaction: Transaction }>(`/transactions/${id}`);
  },

  async createTransaction(data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return request<{ transaction: Transaction }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTransaction(id: string, data: Partial<Transaction>) {
    return request<{ transaction: Transaction }>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTransaction(id: string) {
    return request<{ success: boolean }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  async bulkImportTransactions(items: any[]) {
    return request<{ success: boolean; count: number; imported: Transaction[] }>('/transactions/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  // Stats & Analytics
  async getStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/analytics/stats');
  },

  // Budgets
  async getBudgets(): Promise<BudgetConfig> {
    return request<BudgetConfig>('/budgets');
  },

  async updateBudgets(data: { monthlyBudget?: number; categoryBudgets?: Record<string, number> }): Promise<BudgetConfig> {
    return request<BudgetConfig>('/budgets', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Savings Goals
  async getSavingsGoals(): Promise<{ goals: SavingsGoal[] }> {
    return request<{ goals: SavingsGoal[] }>('/analytics/savings-goals');
  },

  async createSavingsGoal(data: { title: string; targetAmount: number; currentAmount?: number; targetDate?: string; category?: string; color?: string }) {
    return request<{ goal: SavingsGoal }>('/analytics/savings-goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSavingsGoal(id: string, updates: Partial<SavingsGoal>) {
    return request<{ goal: SavingsGoal }>(`/analytics/savings-goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteSavingsGoal(id: string) {
    return request<{ success: boolean }>(`/analytics/savings-goals/${id}`, {
      method: 'DELETE',
    });
  },

  // System & Health
  async getHealth() {
    return request<any>('/health');
  },

  async getPortfolioInfo() {
    return request<any>('/portfolio-info');
  },
};
