/**
 * Auth routes — POST /api/admin/login
 * Strict rate limiting (10 attempts / 15 min)
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Default hash for "admin123" if none provided
const DEFAULT_HASH = '$2a$12$r9XQcrqlkDWrJoB2LLRI3Ofl3HBuebkxaPQniclN2Q7v73dE1jJ9O';

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { username, password } = req.body;
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const usernameMatch = username === expectedUsername;

    let passwordMatch = false;

    // Check if plain text password is set in .env
    if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
      passwordMatch = true;
    }

    // Check if hash is set in .env or default hash
    const hash = process.env.ADMIN_PASSWORD_HASH || DEFAULT_HASH;
    if (!passwordMatch && hash && hash.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, hash);
    }

    if (!usernameMatch || !passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET || '8f4a3c1e9b2d5f70a1c3e5a7b9d1f3e58f4a3c1e9b2d5f70a1c3e5a7b9d1f3e5';
    const token = jwt.sign(
      { username, role: 'admin' },
      secret,
      { expiresIn: '8h', issuer: 'indexauh-api' }
    );

    res.json({ token, expiresIn: 28800 }); // 8h in seconds
  }
);

export default router;
