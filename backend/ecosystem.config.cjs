// PM2 ecosystem config for production (Hostinger VPS)
// Start: pm2 start ecosystem.config.cjs
// Reload: pm2 reload indexauh-api
// Logs:   pm2 logs indexauh-api

module.exports = {
  apps: [
    {
      name: 'indexauh-api',
      script: 'src/server.js',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};
