import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import issuesRouter from './routes/issues.js';
import ngosRouter from './routes/ngos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

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
