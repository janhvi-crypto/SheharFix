import { Router } from 'express';
import { NGO } from '../models/NGO.js';

const router = Router();

// List NGOs (basic filters by name)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const find = q ? { name: new RegExp(String(q), 'i') } : {};
    const rows = await NGO.find(find).sort({ createdAt: -1 });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'failed to list ngos' });
  }
});

// Create NGO
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, website, focus_areas } = req.body || {};
    if (!name || String(name).trim() === '') return res.status(400).json({ error: 'name is required' });
    const exists = await NGO.findOne({ name });
    if (exists) return res.status(409).json({ error: 'name already exists' });
    const row = await NGO.create({ name: String(name).trim(), email, phone, address, website, focus_areas });
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: 'failed to create ngo' });
  }
});

// Get NGO by id
router.get('/:id', async (req, res) => {
  try {
    const row = await NGO.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

// Update NGO
router.patch('/:id', async (req, res) => {
  try {
    const allowed = ['name', 'email', 'phone', 'address', 'website', 'focus_areas'];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'nothing to update' });
    const row = await NGO.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: 'failed to update ngo' });
  }
});

// Delete NGO
router.delete('/:id', async (req, res) => {
  try {
    const info = await NGO.findByIdAndDelete(req.params.id);
    if (!info) return res.status(404).json({ error: 'not found' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'failed to delete ngo' });
  }
});

export default router;
