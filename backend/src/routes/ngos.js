import { Router } from 'express';
import { NGO } from '../models/NGO.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (e) {
    res.status(500).json({ error: 'failed to get ngos' });
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, phone, address, website, focus_areas } = req.body;
    const ngo = await NGO.create({ name, email, phone, address, website, focus_areas });
    res.status(201).json(ngo);
  } catch (e) {
    res.status(500).json({ error: 'failed to create ngo' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'ngo not found' });
    res.json(ngo);
  } catch (e) {
    res.status(500).json({ error: 'failed to get ngo' });
  }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, phone, address, website, focus_areas } = req.body;
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, website, focus_areas },
      { new: true }
    );
    if (!ngo) return res.status(404).json({ error: 'ngo not found' });
    res.json(ngo);
  } catch (e) {
    res.status(500).json({ error: 'failed to update ngo' });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'ngo not found' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'failed to delete ngo' });
  }
});

export default router;