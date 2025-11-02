# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy application code
COPY . .

# Build the application (ignore TypeScript errors in test files)
RUN node ace build --ignore-ts-errors

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/build ./

# Install production dependencies using npm (as recommended by AdonisJS)
RUN npm install --omit=dev --ignore-scripts

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R node:node /app/uploads

# Switch to non-root user
USER node

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "bin/server.js"]
