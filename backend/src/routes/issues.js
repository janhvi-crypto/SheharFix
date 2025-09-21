import { Router } from 'express';
import multer from 'multer';
import { Issue } from '../models/Issue.js';
import { NGO } from '../models/NGO.js';
import { uploadBuffer } from '../config/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// List issues with basic filters
router.get('/', async (req, res) => {
  try {
    const { status, category, limit = 50, skip = 0 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (category) q.category = category;
    const rows = await Issue.find(q).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip));
    res.json(rows);
  } catch (e) {
    console.error('[issues:list]', e);
    res.status(500).json({ error: 'failed to list issues' });
  }
});

// Get single issue
router.get('/:id', async (req, res) => {
  try {
    const row = await Issue.findById(req.params.id).populate('assignedNgos');
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

// Create issue (multipart, optional media)
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { title, description, category, priority = 'medium', lat, lng, address } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    let mediaUrl = undefined;
    if (req.file && req.file.buffer) {
      try {
        const result = await uploadBuffer(req.file.buffer, 'sheharfix/issues');
        mediaUrl = result?.secure_url;
      } catch (e) {
        console.warn('[cloudinary] upload failed, proceeding without media');
      }
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      status: 'submitted',
      location: {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        address: address || undefined,
      },
      mediaUrl,
    });
    res.status(201).json(issue);
  } catch (e) {
    console.error('[issues:create]', e);
    res.status(500).json({ error: 'failed to create issue' });
  }
});

// Replace media for an issue
router.patch('/:id/media', upload.single('media'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'no media uploaded' });
    const result = await uploadBuffer(req.file.buffer, 'sheharfix/issues');
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { mediaUrl: result?.secure_url },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: 'not found' });
    res.json(issue);
  } catch (e) {
    console.error('[issues:media]', e);
    res.status(500).json({ error: 'failed to update media' });
  }
});

// Update status / priority
router.patch('/:id', async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.priority) updates.priority = req.body.priority;
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    const issue = await Issue.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!issue) return res.status(404).json({ error: 'not found' });
    res.json(issue);
  } catch (e) {
    res.status(500).json({ error: 'failed to update issue' });
  }
});

// NGOs assigned to an issue
router.get('/:id/ngos', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('assignedNgos');
    if (!issue) return res.status(404).json({ error: 'not found' });
    res.json(issue.assignedNgos || []);
  } catch (e) {
    res.status(500).json({ error: 'failed to load ngos' });
  }
});

router.post('/:id/ngos', async (req, res) => {
  try {
    const { ngo_id } = req.body || {};
    if (!ngo_id) return res.status(400).json({ error: 'ngo_id is required' });
    const ngo = await NGO.findById(ngo_id);
    if (!ngo) return res.status(404).json({ error: 'ngo not found' });
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    const exists = (issue.assignedNgos || []).some(id => String(id) === String(ngo_id));
    if (!exists) issue.assignedNgos.push(ngo_id);
    await issue.save();
    await issue.populate('assignedNgos');
    res.status(201).json(issue.assignedNgos);
  } catch (e) {
    res.status(500).json({ error: 'failed to assign ngo' });
  }
});

router.delete('/:id/ngos/:ngoId', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    issue.assignedNgos = (issue.assignedNgos || []).filter(id => String(id) !== String(req.params.ngoId));
    await issue.save();
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'failed to unassign ngo' });
  }
});

export default router;
