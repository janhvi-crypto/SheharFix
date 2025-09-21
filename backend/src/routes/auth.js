import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'username already exists' });
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, passwordHash, role: role === 'admin' ? 'admin' : 'citizen' });
    return res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (e) {
    console.error('[register]', e);
    res.status(500).json({ error: 'failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, avatarUrl: user.avatarUrl } });
  } catch (e) {
    console.error('[login]', e);
    res.status(500).json({ error: 'failed to login' });
  }
});

export default router;
