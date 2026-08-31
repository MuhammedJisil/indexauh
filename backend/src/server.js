/**
 * Server entry point — starts the Express app.
 */
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Index Tracking API running on port ${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health      : http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
