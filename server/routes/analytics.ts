import { Router } from 'express';
import { db } from '../storage/db';
import { getAuthUser } from './auth';

export const analyticsRouter = Router();

// GET comprehensive dashboard stats
analyticsRouter.get('/stats', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const stats = db.getDashboardStats(user.id);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to compute dashboard stats.' });
  }
});

// GET Savings Goals
analyticsRouter.get('/savings-goals', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const goals = db.getSavingsGoals(user.id);
    res.json({ goals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Savings Goal
analyticsRouter.post('/savings-goals', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const { title, targetAmount, currentAmount, targetDate, category, color } = req.body;
    if (!title || !targetAmount) {
      return res.status(400).json({ error: 'Title and target amount are required.' });
    }

    const goal = db.createSavingsGoal(user.id, {
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate: targetDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      category,
      color,
    });

    res.status(201).json({ goal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update savings goal (e.g. deposit funds)
analyticsRouter.put('/savings-goals/:id', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const updated = db.updateSavingsGoal(user.id, req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Savings goal not found.' });
    }
    res.json({ goal: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE savings goal
analyticsRouter.delete('/savings-goals/:id', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const success = db.deleteSavingsGoal(user.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Savings goal not found.' });
    }
    res.json({ success: true, message: 'Savings goal deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
