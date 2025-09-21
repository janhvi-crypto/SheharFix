import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'sheharfix.db');

let dbInstance;

export function getDb() {
  if (!dbInstance) {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
  }
  return dbInstance;
}

export function ensureDb() {
  const db = getDb();
  // Users table
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('citizen','admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();

  // Issues table
  db.prepare(`CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted','acknowledged','in_progress','resolved')),
      lat REAL,
      lng REAL,
      media_path TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES users(id)
  )`).run();

  // NGOs table
  db.prepare(`CREATE TABLE IF NOT EXISTS ngos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT,
      phone TEXT,
      address TEXT,
      website TEXT,
      focus_areas TEXT, -- comma-separated or JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();

  // Junction table: which NGO is linked/assigned to which issue
  db.prepare(`CREATE TABLE IF NOT EXISTS issue_ngos (
      issue_id INTEGER NOT NULL,
      ngo_id INTEGER NOT NULL,
      role TEXT, -- e.g., 'assigned','partner','volunteer'
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (issue_id, ngo_id),
      FOREIGN KEY(issue_id) REFERENCES issues(id) ON DELETE CASCADE,
      FOREIGN KEY(ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
  )`).run();

  // Seed an admin if none exists
  const count = db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('admin')?.c ?? 0;
  if (count === 0) {
    // default admin: admin/admin123 (will be updated on first login ideally)
    try {
      const require = createRequire(import.meta.url);
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('admin123', 10);
      db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'admin');
      console.log('Seeded default admin user: admin / admin123');
    } catch (e) {
      // ignore seed errors
    }
  }

  // Seed two dummy issues if none exist (for testing)
  try {
    const issueCount = db.prepare('SELECT COUNT(*) as c FROM issues').get()?.c ?? 0;
    if (issueCount === 0) {
      const insertIssue = db.prepare(`INSERT INTO issues (title, description, category, priority, status, lat, lng, media_path, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      const rows = [
        ['Large pothole on MG Road', 'Deep pothole causing traffic congestion near bus stop', 'roads', 'high', 'in_progress', 12.9716, 77.5946],
        ['Overflowing garbage bin', 'Garbage bin overflowing for 3 days, creating hygiene issues', 'sanitation', 'medium', 'acknowledged', 12.9352, 77.6245],
        ['Blocked drainage causing flooding', 'Drainage system completely blocked after recent rains', 'drainage', 'high', 'in_progress', 12.9279, 77.6271],
        ['Street light not working', 'Multiple street lights not functioning, safety concern', 'lighting', 'medium', 'acknowledged', 12.9719, 77.6412],
        ['Broken footpath tiles', 'Damaged tiles pose a tripping hazard for pedestrians', 'roads', 'low', 'submitted', 12.9141, 77.6387],
        ['Open manhole cover', 'Open manhole is a serious safety risk', 'drainage', 'high', 'in_progress', 12.9647, 77.5848],
        ['Illegal garbage dumping', 'Frequent dumping of waste in residential lane', 'sanitation', 'medium', 'acknowledged', 12.9182, 77.6100]
      ];
      const createdBy = 1;
      for (const [title, description, category, priority, status, lat, lng] of rows) {
        insertIssue.run(title, description, category, priority, status, lat, lng, null, createdBy);
      }
      console.log('Seeded 7 dummy issues for testing.');
    }
  } catch {}

  // Seed demo NGOs if none exist (for testing)
  try {
    const ngoCount = db.prepare('SELECT COUNT(*) as c FROM ngos').get()?.c ?? 0;
    if (ngoCount === 0) {
      const insertNgo = db.prepare(`INSERT INTO ngos (name, email, phone, address, website, focus_areas) VALUES (?, ?, ?, ?, ?, ?)`);
      insertNgo.run('Green City Trust', 'contact@greencity.org', '+91-90000-11111', 'MG Road, Bengaluru', 'https://greencity.org', 'sanitation,roads');
      insertNgo.run('LightUp Initiative', 'hello@lightup.in', '+91-90000-22222', 'Indiranagar, Bengaluru', 'https://lightup.in', 'lighting,safety');
      insertNgo.run('Clean Drain Foundation', 'info@cleandrain.org', '+91-90000-33333', 'BTM Layout, Bengaluru', 'https://cleandrain.org', 'drainage,water');
      console.log('Seeded 3 demo NGOs for testing.');
    }
  } catch {}
}

