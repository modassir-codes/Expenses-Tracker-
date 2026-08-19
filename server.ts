import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/routes/auth';
import { transactionsRouter } from './server/routes/transactions';
import { budgetsRouter } from './server/routes/budgets';
import { analyticsRouter } from './server/routes/analytics';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'AuraSpend Premium Expense Tracker',
      version: '1.0.0',
      developer: 'Modassir Raja',
      mongoConnected: Boolean(process.env.MONGODB_URI),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/portfolio-info', (req, res) => {
    res.json({
      developer: 'Modassir Raja',
      role: 'Full Stack Web Developer',
      tagline: 'Building High-Performance, Pixel-Perfect Modern Web Applications',
      email: 'modassirraza722083@gmail.com',
      techStack: [
        'React 19',
        'TypeScript',
        'Node.js',
        'Express.js',
        'MongoDB / Resilient Store',
        'Tailwind CSS',
        'Recharts',
        'Motion',
      ],
      features: [
        'Multi-User Authentication & Profile Control',
        'Income & Expense Tracking with Instant Modals',
        'Category-Wise Budget Thresholds & Visual Warnings',
        'Interactive Analytics Charts & Monthly Trends',
        'CSV Export and Bulk Transaction Imports',
        'Dark / Light Mode SaaS-Grade Interface',
      ],
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/budgets', budgetsRouter);
  app.use('/api/analytics', analyticsRouter);

  // Vite Middleware (Development) vs Static Serving (Production)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AuraSpend Server active on http://localhost:${PORT}`);
    console.log(`👤 Developer: Modassir Raja (Full Stack Web Developer)`);
  });
}

startServer().catch(err => {
  console.error('Failed to start AuraSpend server:', err);
  process.exit(1);
});
