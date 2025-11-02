FROM node:20-alpine

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

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R node:node /app/uploads

# Switch to non-root user
USER node

# Expose port
EXPOSE 3333

# Start the application
# AdonisJS compile les fichiers dans le répertoire build/
CMD ["node", "build/bin/server.js"]
