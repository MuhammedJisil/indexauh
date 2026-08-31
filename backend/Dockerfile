# ============================================================
#  Dockerfile — Index Office Services Tracking API
# ============================================================
FROM node:22-alpine AS base

# Install curl for container healthchecks
RUN apk --no-cache add curl

WORKDIR /app

# Install production dependencies first (caching layer)
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy application source
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R node:node /app

# Switch to non-root node user for security
USER node

# Expose API port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Run database migrations on startup, then launch server
CMD ["sh", "-c", "node src/migrate.js && node src/server.js"]
