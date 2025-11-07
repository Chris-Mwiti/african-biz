# Stage 1: Build the application
FROM oven/bun:1.1.17 as builder

WORKDIR /app

# Copy package.json and bun.lockb to install dependencies
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN bun run build

# Stage 2: Run the application
FROM oven/bun:1.1.17

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./ # Consider how to manage .env in production (e.g., Kubernetes secrets, environment variables)

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["bun", "run", "start"]
