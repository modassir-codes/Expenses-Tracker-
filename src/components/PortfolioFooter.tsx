import React from 'react';
import { Sparkles, Code2, Globe, Heart, Shield } from 'lucide-react';

interface PortfolioFooterProps {
  onOpenDocs: () => void;
}

export const PortfolioFooter: React.FC<PortfolioFooterProps> = ({ onOpenDocs }) => {
  return (
    <footer
      id="app-portfolio-footer"
      className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs py-6 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Left: Branding & Developer Credit */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">
            Built by Modassir Raja • Full Stack Web Developer
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-500">
            Portfolio SaaS Edition
          </span>
        </div>

        {/* Right: Interactive Docs Trigger & Tech Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDocs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/70 transition-all cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Setup & Architecture Guide</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>React 19 • Node • Express • REST</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
