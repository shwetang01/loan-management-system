import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { validateEnv } from './config/env';

// Route imports
import authRoutes from './routes/auth';
import borrowerRoutes from './routes/borrower';
import salesRoutes from './routes/sales';
import sanctionRoutes from './routes/sanction';
import disbursementRoutes from './routes/disbursement';
import collectionRoutes from './routes/collection';

dotenv.config();
validateEnv();

const app: Application = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/borrower', borrowerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/sanction', sanctionRoutes);
app.use('/api/disbursement', disbursementRoutes);
app.use('/api/collection', collectionRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

export default app;
