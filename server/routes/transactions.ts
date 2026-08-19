import { Router } from 'express';
import { db } from '../storage/db';
import { getAuthUser } from './auth';

export const transactionsRouter = Router();

// GET all transactions with filters
transactionsRouter.get('/', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const {
      search,
      type,
      category,
      paymentMethod,
      startDate,
      endDate,
      sortBy,
      page = '1',
      limit = '50',
    } = req.query as Record<string, string>;

    const all = db.getTransactions(user.id, {
      search,
      type,
      category,
      paymentMethod,
      startDate,
      endDate,
      sortBy,
    });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = all.slice(startIndex, startIndex + limitNum);

    res.json({
      transactions: paginated,
      total: all.length,
      page: pageNum,
      totalPages: Math.ceil(all.length / limitNum),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch transactions.' });
  }
});

// GET single transaction
transactionsRouter.get('/:id', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const tx = db.getTransactionById(user.id, req.params.id);
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }
    res.json({ transaction: tx });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new transaction
transactionsRouter.post('/', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const { amount, type, category, description, date, paymentMethod, notes, tags } = req.body;

    if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'A positive amount is required.' });
    }

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Valid transaction type (income or expense) is required.' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Category is required.' });
    }

    const created = db.createTransaction(user.id, {
      amount: Number(amount),
      type,
      category,
      description: description || 'Untitled',
      date: date || new Date().toISOString().slice(0, 10),
      paymentMethod,
      notes,
      tags,
    });

    res.status(201).json({ transaction: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create transaction.' });
  }
});

// PUT update transaction
transactionsRouter.put('/:id', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const { amount, type, category, description, date, paymentMethod, notes, tags } = req.body;

    const updated = db.updateTransaction(user.id, req.params.id, {
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date }),
      ...(paymentMethod !== undefined && { paymentMethod }),
      ...(notes !== undefined && { notes }),
      ...(tags !== undefined && { tags }),
    });

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found or could not be updated.' });
    }

    res.json({ transaction: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update transaction.' });
  }
});

// DELETE transaction
transactionsRouter.delete('/:id', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const success = db.deleteTransaction(user.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    res.json({ success: true, message: 'Transaction deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete transaction.' });
  }
});

// Bulk Import
transactionsRouter.post('/bulk-import', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Valid array of items is required.' });
    }

    const imported = [];
    for (const item of items) {
      if (item.amount && item.type && item.category) {
        const tx = db.createTransaction(user.id, {
          amount: Math.abs(Number(item.amount)),
          type: item.type === 'income' ? 'income' : 'expense',
          category: item.category,
          description: item.description || 'Imported Entry',
          date: item.date || new Date().toISOString().slice(0, 10),
          paymentMethod: item.paymentMethod || 'Other',
          notes: item.notes || 'Imported via CSV',
          tags: item.tags || ['Imported'],
        });
        imported.push(tx);
      }
    }

    res.json({ success: true, count: imported.length, imported });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Bulk import failed.' });
  }
});

// CSV Export
transactionsRouter.get('/export/csv', (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });

    const list = db.getTransactions(user.id);
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method', 'Notes', 'Tags'];
    const rows = list.map(t => [
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${t.paymentMethod || ''}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      `"${(t.tags || []).join(';')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="AuraSpend_Transactions_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
