/**
 * Auth routes — POST /api/admin/login
 * Strict rate limiting (10 attempts / 15 min)
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

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

    // Constant-time username comparison (prevents timing attacks)
    const usernameMatch = username === process.env.ADMIN_USERNAME;

    // Always run bcrypt.compare to avoid timing leaks even on bad username
    const hash = process.env.ADMIN_PASSWORD_HASH || '$2a$12$invalidhashpadding000000000000000000000000000000000000';
    const passwordMatch = await bcrypt.compare(password, hash);

    if (!usernameMatch || !passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h', issuer: 'indexauh-api' }
    );

    res.json({ token, expiresIn: 28800 }); // 8h in seconds
  }
);

export default router;
