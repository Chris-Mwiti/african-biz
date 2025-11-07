# Stage 1: Build the React application
FROM oven/bun:1.1.17 as builder

WORKDIR /app/frontend

# Copy package.json and bun.lockb to install dependencies
COPY frontend/package.json frontend/bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY frontend/. ./

# Build the React application
# Ensure VITE_API_BASE_URL is set during build if it's a build-time variable
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy custom Nginx configuration
# Create a default.conf in your frontend directory if you need custom Nginx config
# COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Create a simple default.conf for serving React app
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
