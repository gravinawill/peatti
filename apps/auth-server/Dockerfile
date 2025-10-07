# Use specific Node.js version for reproducibility
FROM node:24.9.0-alpine AS base

# Create app directory with proper permissions
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
  curl \
  tini \
  dumb-init \
  && rm -rf /var/cache/apk/*

# Create non-root user early
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs hono

FROM base AS builder-base

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

FROM builder-base AS builder

# Copy workspace configuration files for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy source code
COPY . .

# Prune workspace for auth-server only
RUN pnpm dlx turbo prune @peatti/auth-server --docker

FROM builder-base AS installer

# Copy pruned workspace
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./
COPY --from=builder /app/turbo.json ./turbo.json

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --prod=false

# Copy full workspace
COPY --from=builder /app/out/full/ .

# Build the application
RUN pnpm --filter=...@peatti/auth-server build

FROM base AS production

# Setup pnpm for production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Copy package files
COPY --from=installer --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=installer --chown=hono:nodejs /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml

# Copy node_modules (production dependencies only)
COPY --from=installer --chown=hono:nodejs /app/node_modules /app/node_modules

# Copy workspace packages
COPY --from=installer --chown=hono:nodejs /app/packages /app/packages

# Copy built auth-server application
COPY --from=installer --chown=hono:nodejs /app/apps/auth-server /app/apps/auth-server

# Switch to non-root user
USER hono

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD curl --fail --silent http://localhost:3001/healthcheck || exit 1

# Expose port
EXPOSE 3001

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application with database migration
CMD ["sh", "-c", "pnpm --filter=auth-server db:migrate:prod && node /app/apps/auth-server/dist/server.js"]
