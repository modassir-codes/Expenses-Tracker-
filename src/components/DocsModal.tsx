import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Terminal,
  Database,
  Globe,
  Key,
  Layers,
  CheckCircle2,
  Copy,
  ExternalLink,
  Code2,
  Cpu,
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'mongodb' | 'env' | 'deploy' | 'api'>('setup');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div
      id="docs-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="docs-modal-container"
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Developer Documentation & Deployment Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by Modassir Raja • Full Stack Web Developer
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-800/40 shrink-0 overflow-x-auto gap-2 py-2">
          {[
            { id: 'setup', label: '1. Quick Start', icon: Terminal },
            { id: 'env', label: '2. Environment Vars', icon: Key },
            { id: 'mongodb', label: '3. Connect MongoDB', icon: Database },
            { id: 'deploy', label: '4. Deployment', icon: Globe },
            { id: 'api', label: '5. REST API Reference', icon: Code2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700 dark:text-slate-300">
          {/* Tab 1: Setup */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Running the Full-Stack Application
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  AuraSpend runs a unified Node/Express backend that mounts Vite in development and serves optimized bundles in production.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step-by-Step Commands</h5>
                
                <div className="relative group">
                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto space-y-2">
                    <p className="text-slate-400"># 1. Clone & install dependencies</p>
                    <p className="text-emerald-400">npm install</p>
                    <p className="text-slate-400"># 2. Start Full-Stack Dev Server (Express + Vite on Port 3000)</p>
                    <p className="text-emerald-400">npm run dev</p>
                    <p className="text-slate-400"># 3. Build for Production</p>
                    <p className="text-emerald-400">npm run build</p>
                    <p className="text-slate-400"># 4. Launch Production Server</p>
                    <p className="text-emerald-400">npm start</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm install\nnpm run dev', 'cmds')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'cmds' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'cmds' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">Architecture Highlights</h5>
                <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li><strong>Zero-Config Resilient Engine:</strong> Works immediately without external DB configuration.</li>
                  <li><strong>MongoDB Ready:</strong> Connects seamlessly with Mongoose when <code>MONGODB_URI</code> is supplied.</li>
                  <li><strong>Multi-User Isolation:</strong> Transactions, budgets, and savings goals are partitioned per user.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Environment Variables */}
          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Environment Configuration (<code>.env</code>)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Create a <code>.env</code> file in your project root using the template below:
                </p>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
{`# Server Port
PORT=3000

# MongoDB URI (Optional: If left blank, uses resilient built-in JSON file/memory store)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auraspend?retryWrites=true&w=majority

# JWT Authentication Secret Key
JWT_SECRET=auraspend_super_secure_jwt_secret_token_2026

# Node Environment
NODE_ENV=development`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `PORT=3000\nMONGODB_URI=\nJWT_SECRET=auraspend_jwt_secret_2026\nNODE_ENV=development`,
                        'env'
                      )
                    }
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'env' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'env' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: MongoDB Setup */}
          {activeTab === 'mongodb' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Connecting MongoDB Atlas
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Follow these simple steps to link your MongoDB database:
                </p>
              </div>

              <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong>Create a Cluster:</strong> Go to <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">MongoDB Atlas</a>, create a free M0 tier cluster.
                </li>
                <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong>Create a Database User:</strong> Under Database Access, create a user with Read & Write privileges.
                </li>
                <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong>Network Access:</strong> Under Network Access, whitelist IP address <code>0.0.0.0/0</code> for cloud deployment access.
                </li>
                <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <strong>Add URI to Environment:</strong> Copy your connection string into <code>MONGODB_URI</code> in <code>.env</code>.
                </li>
              </ol>
            </div>
          )}

          {/* Tab 4: Deploying */}
          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Deployment Options & Getting Live URL
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  AuraSpend is production-ready for Google Cloud Run, Render, Railway, or Vercel with Node Server.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white">Option A: Google Cloud Run / Docker</h5>
                  <p className="text-slate-600 dark:text-slate-400">
                    Use the standard container build. Cloud Run maps port 3000 and automatically allocates a secure <code>https://*.run.app</code> URL.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white">Option B: Render / Railway</h5>
                  <p className="text-slate-600 dark:text-slate-400">
                    Set Build Command: <code>npm run build</code><br />
                    Set Start Command: <code>npm start</code><br />
                    Provides a live <code>https://*.onrender.com</code> URL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: REST API Reference */}
          {activeTab === 'api' && (
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">REST API Endpoints</h4>
              <div className="space-y-2 font-mono">
                {[
                  { method: 'POST', path: '/api/auth/register', desc: 'Register new user account' },
                  { method: 'POST', path: '/api/auth/login', desc: 'Sign in with email & password' },
                  { method: 'POST', path: '/api/auth/demo-login', desc: '1-Click developer demo login' },
                  { method: 'GET', path: '/api/transactions', desc: 'Query transactions with type, category, date filter' },
                  { method: 'POST', path: '/api/transactions', desc: 'Create new transaction' },
                  { method: 'PUT', path: '/api/transactions/:id', desc: 'Update transaction by ID' },
                  { method: 'DELETE', path: '/api/transactions/:id', desc: 'Delete transaction by ID' },
                  { method: 'GET', path: '/api/analytics/stats', desc: 'Get aggregated financial dashboard analytics' },
                  { method: 'GET', path: '/api/budgets', desc: 'Retrieve monthly & category budget limits' },
                  { method: 'PUT', path: '/api/budgets', desc: 'Update category budget thresholds' },
                  { method: 'GET', path: '/api/transactions/export/csv', desc: 'Download CSV of transactions' },
                ].map((ep, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : ep.method === 'PUT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'}`}>
                        {ep.method}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{ep.path}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Portfolio Project by</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Modassir Raja</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
