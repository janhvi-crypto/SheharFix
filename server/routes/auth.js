import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = Router();

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const userRole = role === 'admin' ? 'admin' : 'citizen';
  const hash = bcrypt.hashSync(password, 10);
  try {
    const info = getDb().prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, userRole);
    return res.json({ id: info.lastInsertRowid, username, role: userRole });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'username already exists' });
    return res.status(500).json({ error: 'failed to register' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = getDb().prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;
