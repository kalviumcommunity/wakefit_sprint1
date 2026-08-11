FROM node:20-slim AS base

# Install OpenSSL for Prisma engine compatibility
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package management files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
RUN npm run build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Startup command ensures database schema is pushed & seeded before app starts
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && npm run start"]
