import { Router } from 'express';
import { db } from '../storage/db';
import { getAuthUser } from './auth';

export const budgetsRouter = Router();

// GET budget config
budgetsRouter.get('/', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const budgetInfo = db.getBudgets(user.id);
    res.json(budgetInfo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update budget config
budgetsRouter.put('/', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const { monthlyBudget, categoryBudgets } = req.body;
    const updated = db.updateBudgets(user.id, monthlyBudget, categoryBudgets);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
