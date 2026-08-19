import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Settings,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'budgets', label: 'Budgets & Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'docs', label: 'Portfolio Docs', icon: BookOpen },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 shrink-0 transition-colors"
      >
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
            Main Menu
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs border border-emerald-200/60 dark:border-emerald-800/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Developer Badge in Sidebar Footer */}
        <div className="mt-auto pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Modassir Raja</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Full Stack Web Developer
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around"
      >
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-none">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
