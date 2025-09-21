import { Router } from 'express';
import { Issue } from '../models/Issue.js';
import { uploadBuffer } from '../config/cloudinary.js';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().populate('createdBy', 'username avatarUrl').sort({ createdAt: -1 });
    res.json(issues);
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to get issues' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority, location, media } = req.body;
    let mediaUrl = '';
    if (media) {
      const { secure_url } = await uploadBuffer(Buffer.from(media, 'base64'));
      mediaUrl = secure_url;
    }

    // Optional auth: if a valid Bearer token is provided, associate createdBy; otherwise allow anonymous
    let createdBy = undefined;
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'dev_secret');
        createdBy = payload.id;
      } catch (err) {
        // Ignore invalid token to allow anonymous submission
      }
    }
    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      location,
      mediaUrl,
      createdBy,
    });
    res.status(201).json(issue);
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to create issue' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('createdBy', 'username avatarUrl').populate('assignedNgos');
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    res.json(issue);
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to get issue' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, category, priority, status, location, assignedNgos } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { title, description, category, priority, status, location, assignedNgos },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    res.json(issue);
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to update issue' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    res.status(204).send();
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to delete issue' });
  }
});

export default router;