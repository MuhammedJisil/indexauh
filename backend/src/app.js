/**
 * Express application setup — security middleware, CORS, routes.
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes   from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes  from './routes/admin.js';

dotenv.config();

const app = express();

// ─── Trust proxy (NGINX on VPS) ──────────────────────────────────────────────
app.set('trust proxy', 1);

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed.`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Global rate limit (defence against DDoS) ────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' },
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/admin', authRoutes);   // POST /api/admin/login
app.use('/api',       publicRoutes); // GET  /api/track/:trackingId
app.use('/api/admin', adminRoutes);  // Admin CRUD (JWT-protected)

// ─── Health check (for NGINX / uptime monitoring) ────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.message?.startsWith('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

export default app;
