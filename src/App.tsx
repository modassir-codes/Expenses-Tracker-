import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetView } from './components/BudgetView';
import { SettingsView } from './components/SettingsView';
import { TransactionModal } from './components/TransactionModal';
import { AuthModal } from './components/AuthModal';
import { DocsModal } from './components/DocsModal';
import { PortfolioFooter } from './components/PortfolioFooter';
import { DashboardStats, Transaction } from './types';
import { api } from './lib/api';

function MainApp() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Modal controls
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user, refreshTrigger]);

  const handleOpenNewTransaction = () => {
    setEditingTransaction(null);
    setTransactionModalOpen(true);
  };

  const handleOpenEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTransactionModalOpen(true);
  };

  const handleSaveTransaction = async (txData: any) => {
    if (editingTransaction) {
      await api.updateTransaction(editingTransaction.id, txData);
    } else {
      await api.createTransaction(txData);
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefreshAll = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-emerald-500 selection:text-white">
      {/* SaaS Navigation Header */}
      <Navbar
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDocs={() => setDocsModalOpen(true)}
        onOpenProfile={() => setActiveView('settings')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        {/* Navigation Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              stats={stats}
              loading={loadingStats}
              onOpenNewTransaction={handleOpenNewTransaction}
              onOpenEditTransaction={handleOpenEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'transactions' && (
            <TransactionsView
              onOpenNewTransaction={handleOpenNewTransaction}
              onOpenEditTransaction={handleOpenEditTransaction}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView stats={stats} loading={loadingStats} />
          )}

          {activeView === 'budgets' && (
            <BudgetView
              stats={stats}
              refreshTrigger={refreshTrigger}
              onRefresh={handleRefreshAll}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              onRefresh={handleRefreshAll}
              onOpenDocs={() => setDocsModalOpen(true)}
            />
          )}

          {activeView === 'docs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Portfolio & Project Guide
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Comprehensive technical walkthrough & deployment documentation
                  </p>
                </div>
                <button
                  onClick={() => setDocsModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Open Full Interactive Guide
                </button>
              </div>

              {/* In-page guide summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">🚀 1. Running Locally</h3>
                  <div className="p-3 bg-slate-950 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
                    <p className="text-slate-400"># Install & Launch</p>
                    <p className="text-emerald-400">npm install</p>
                    <p className="text-emerald-400">npm run dev</p>
                  </div>
                  <p className="text-slate-500">Binds Express and Vite on http://localhost:3000.</p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">🍃 2. MongoDB Atlas Connection</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Add your connection string in <code>.env</code> under <code>MONGODB_URI</code>. The app automatically provisions schema collections.
                  </p>
                  <div className="p-3 bg-slate-950 text-slate-100 rounded-xl font-mono text-[11px]">
                    MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/auraspend
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">☁️ 3. Cloud Deployment</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Supports Google Cloud Run, Render, and Railway using <code>npm run build</code> and <code>npm start</code>.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">👤 4. Developer Credit</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Developed by <strong>Modassir Raja</strong> • Full Stack Web Developer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Persistent Portfolio Footer */}
      <PortfolioFooter onOpenDocs={() => setDocsModalOpen(true)} />

      {/* Modals */}
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        transactionToEdit={editingTransaction}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
