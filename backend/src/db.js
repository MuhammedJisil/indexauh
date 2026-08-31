/**
 * PostgreSQL connection pool
 * All queries in the app go through this pool.
 */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client:', err.message);
  process.exit(-1);
});

// Test connection on startup
pool.query('SELECT 1').then(() => {
  console.log('✅ PostgreSQL connected');
}).catch((err) => {
  console.error('❌ PostgreSQL connection failed:', err.message);
  process.exit(1);
});

export default pool;
