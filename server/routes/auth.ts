import { Router } from 'express';
import { db } from '../storage/db';

export const authRouter = Router();

// Middleware to extract user from Authorization header
export function getAuthUser(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Default to the demo user if no token provided, ensuring immediate zero-barrier preview
    return db.findUserById('usr_modassir_demo');
  }
  const token = authHeader.split(' ')[1];
  // Simple token format: user_<id> or base64 user id
  if (token.startsWith('user_')) {
    const userId = token.replace('user_', '');
    return db.findUserById(userId) || db.findUserById('usr_modassir_demo');
  }
  return db.findUserById(token) || db.findUserById('usr_modassir_demo');
}

// Register
authRouter.post('/register', (req, res) => {
  try {
    const { name, email, password, currency, monthlyBudget } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const user = db.createUser({
      name,
      email,
      passwordHash: password, // In production could be hashed with bcrypt
      currency: currency || '$',
      monthlyBudget: monthlyBudget ? Number(monthlyBudget) : 3000,
    });

    const token = `user_${user.id}`;
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

// Login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const token = `user_${user.id}`;
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

// One-click demo login for portfolio reviewers
authRouter.post('/demo-login', (req, res) => {
  try {
    let demoUser = db.findUserById('usr_modassir_demo');
    if (!demoUser) {
      db.resetToDemo('usr_modassir_demo');
      demoUser = db.findUserById('usr_modassir_demo');
    }

    const token = `user_${demoUser?.id || 'usr_modassir_demo'}`;
    res.json({
      token,
      user: demoUser,
      message: 'Logged in as Demo Portfolio User (Modassir Raja)',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Demo login failed.' });
  }
});

// Current User profile
authRouter.get('/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

// Update Profile
authRouter.put('/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { name, email, currency, monthlyBudget, avatar } = req.body;
  const updated = db.updateUserProfile(user.id, {
    name,
    email,
    currency,
    monthlyBudget,
    avatar,
  });

  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
      monthlyBudget: updated.monthlyBudget,
      avatar: updated.avatar,
      createdAt: updated.createdAt,
    },
  });
});

// Reset Demo Data
authRouter.post('/reset-demo', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  db.resetToDemo(user.id);
  res.json({ success: true, message: 'Database reset to default realistic portfolio dataset.' });
});
