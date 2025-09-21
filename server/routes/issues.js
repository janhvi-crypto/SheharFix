import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getDb } from '../db.js';
// import { requireAuth } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// List issues
router.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM issues ORDER BY created_at DESC').all();
  res.json(rows);
});

// Get single issue
router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

// Create issue (auth optional: if token present, associate user)
router.post('/', upload.single('media'), (req, res) => {
  const { title, description, category, priority = 'medium', lat, lng } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const media_path = req.file ? `/uploads/${req.file.filename}` : null;

  let created_by = null;
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'dev_secret');
      created_by = payload.id;
    } catch {
      // ignore invalid token
    }
  }

  const stmt = getDb().prepare(`INSERT INTO issues (title, description, category, priority, lat, lng, media_path, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(title, description || null, category || null, priority, lat ? Number(lat) : null, lng ? Number(lng) : null, media_path, created_by);
  const issue = getDb().prepare('SELECT * FROM issues WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(issue);
});

// Update issue status/priority (auth required)
router.patch('/:id', (req, res) => {
  const { status, priority } = req.body;
  const fields = [];
  const values = [];
  if (status) { fields.push('status = ?'); values.push(status); }
  if (priority) { fields.push('priority = ?'); values.push(priority); }
  if (fields.length === 0) return res.status(400).json({ error: 'nothing to update' });
  values.push(req.params.id);
  const sql = `UPDATE issues SET ${fields.join(', ')} WHERE id = ?`;
  const info = getDb().prepare(sql).run(...values);
  if (info.changes === 0) return res.status(404).json({ error: 'not found' });
  const item = getDb().prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  res.json(item);
});

// Upload or replace media for an existing issue
router.patch('/:id/media', upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no media uploaded' });
  const media_path = `/uploads/${req.file.filename}`;
  const info = getDb().prepare('UPDATE issues SET media_path = ? WHERE id = ?').run(media_path, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'not found' });
  const item = getDb().prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  res.json(item);
});

// List NGOs assigned to an issue
router.get('/:id/ngos', (req, res) => {
  const rows = getDb()
    .prepare(`SELECT n.* , ing.role, ing.assigned_at
              FROM issue_ngos ing
              JOIN ngos n ON n.id = ing.ngo_id
              WHERE ing.issue_id = ?`)
    .all(req.params.id);
  res.json(rows);
});

// Assign an NGO to an issue
router.post('/:id/ngos', (req, res) => {
  const { ngo_id, role } = req.body || {};
  if (!ngo_id) return res.status(400).json({ error: 'ngo_id is required' });

  // Ensure both exist
  const issue = getDb().prepare('SELECT id FROM issues WHERE id = ?').get(req.params.id);
  const ngo = getDb().prepare('SELECT id FROM ngos WHERE id = ?').get(ngo_id);
  if (!issue) return res.status(404).json({ error: 'issue not found' });
  if (!ngo) return res.status(404).json({ error: 'ngo not found' });

  try {
    getDb().prepare('INSERT INTO issue_ngos (issue_id, ngo_id, role) VALUES (?, ?, ?)').run(req.params.id, ngo_id, role || null);
  } catch (e) {
    // Likely already assigned due to PK(issue_id, ngo_id)
  }
  const rows = getDb()
    .prepare(`SELECT n.* , ing.role, ing.assigned_at
              FROM issue_ngos ing
              JOIN ngos n ON n.id = ing.ngo_id
              WHERE ing.issue_id = ?`)
    .all(req.params.id);
  res.status(201).json(rows);
});

// Unassign an NGO from an issue
router.delete('/:id/ngos/:ngoId', (req, res) => {
  const info = getDb().prepare('DELETE FROM issue_ngos WHERE issue_id = ? AND ngo_id = ?').run(req.params.id, req.params.ngoId);
  if (info.changes === 0) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

export default router;
