import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

// List NGOs
router.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM ngos ORDER BY created_at DESC').all();
  res.json(rows);
});

// Create NGO
router.post('/', (req, res) => {
  const { name, email, phone, address, website, focus_areas } = req.body || {};
  if (!name || String(name).trim() === '') return res.status(400).json({ error: 'name is required' });
  try {
    const info = getDb()
      .prepare('INSERT INTO ngos (name, email, phone, address, website, focus_areas) VALUES (?, ?, ?, ?, ?, ?)')
      .run(String(name).trim(), email || null, phone || null, address || null, website || null, focus_areas || null);
    const row = getDb().prepare('SELECT * FROM ngos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(row);
  } catch (e) {
    if (String(e.message || '').includes('UNIQUE')) return res.status(409).json({ error: 'name already exists' });
    return res.status(500).json({ error: 'failed to create ngo' });
  }
});

// Read NGO by id
router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM ngos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

// Update NGO
router.patch('/:id', (req, res) => {
  const allowed = ['name', 'email', 'phone', 'address', 'website', 'focus_areas'];
  const fields = [];
  const values = [];
  for (const key of allowed) {
    if (key in req.body) {
      fields.push(`${key} = ?`);
      values.push(req.body[key] || null);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'nothing to update' });
  values.push(req.params.id);
  try {
    const sql = `UPDATE ngos SET ${fields.join(', ')} WHERE id = ?`;
    const info = getDb().prepare(sql).run(...values);
    if (info.changes === 0) return res.status(404).json({ error: 'not found' });
    const row = getDb().prepare('SELECT * FROM ngos WHERE id = ?').get(req.params.id);
    res.json(row);
  } catch (e) {
    if (String(e.message || '').includes('UNIQUE')) return res.status(409).json({ error: 'name already exists' });
    return res.status(500).json({ error: 'failed to update ngo' });
  }
});

// Delete NGO
router.delete('/:id', (req, res) => {
  const info = getDb().prepare('DELETE FROM ngos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

export default router;
