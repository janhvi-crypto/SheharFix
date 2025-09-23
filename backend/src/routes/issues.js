import { Router } from 'express';
import { Issue } from '../models/Issue.js';
import { uploadBuffer } from '../config/cloudinary.js';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query || {};
    const query = {};
    if (status && ['submitted','acknowledged','in_progress','resolved'].includes(String(status))) {
      query.status = String(status);
    }
    const issues = await Issue.find(query).populate('createdBy', '_id username avatarUrl').sort({ createdAt: -1 });
    res.json(issues);
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to get issues' });
  }
});

// Danger: Delete ALL issues (development only)
router.delete('/', requireAuth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'forbidden' });
    }
    await Issue.deleteMany({});
    res.status(204).send();
  } catch (e) {
    console.error('[issues] delete all', e);
    res.status(500).json({ error: 'failed to delete all issues' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority, location, media } = req.body;
    let mediaUrl = '';
    if (media) {
      try {
        const result = await uploadBuffer(Buffer.from(media, 'base64'));
        if (result && result.secure_url) {
          mediaUrl = result.secure_url;
        } else {
          console.warn('[issues] upload returned no result/secure_url, proceeding without media');
        }
      } catch (upErr) {
        console.warn('[issues] media upload failed, proceeding without media', upErr);
      }
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
    const issue = await Issue.findById(req.params.id).populate('createdBy', '_id username avatarUrl').populate('assignedNgos');
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

// Mark as resolved with required photo
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { media, note } = req.body || {};
    if (!media) return res.status(400).json({ error: 'resolution photo (media) required' });

    let resolutionPhotoUrl = '';
    try {
      const result = await uploadBuffer(Buffer.from(media, 'base64'), 'sheharfix-resolutions');
      if (result && result.secure_url) resolutionPhotoUrl = result.secure_url;
    } catch (err) {
      console.warn('[issues] resolution upload failed, proceeding without photo', err);
    }

    // Optional auth: capture who resolved if token provided
    let resolvedBy = undefined;
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'dev_secret');
        resolvedBy = payload.id;
      } catch {}
    }

    const update = {
      status: 'resolved',
      resolvedAt: new Date(),
      resolvedBy,
      resolutionPhotoUrl: resolutionPhotoUrl || undefined,
      resolutionNote: note || undefined,
    };
    const issue = await Issue.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    res.json(issue);
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to resolve issue' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    // Only the original reporter can delete; admins are not allowed
    if (req.user?.role === 'admin') {
      return res.status(403).json({ error: 'forbidden' });
    }
    const isOwner = issue.createdBy && String(issue.createdBy) === String(req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'forbidden' });
    }
    await Issue.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (e) {
    console.error('[issues]', e);
    res.status(500).json({ error: 'failed to delete issue' });
  }
});

export default router;