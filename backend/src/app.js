import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import issuesRouter from './routes/issues.js';
import ngosRouter from './routes/ngos.js';

// Load env from backend/.env explicitly so running from repo root still uses backend credentials
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
// Increase limit to handle base64-encoded images in JSON payloads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// This line handles favicon requests from browsers
app.use('/favicon.ico', (req, res) => res.status(204).end());

// Serve local uploads when Cloudinary is unavailable (fallback)
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/ngos', ngosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`[API] Listening on http://localhost:${PORT}`));
  } catch (e) {
    console.error('[Startup Error]', e);
    process.exit(1);
  }
})();