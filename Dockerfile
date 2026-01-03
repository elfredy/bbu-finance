# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from backend
COPY backend/package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy backend source code
COPY backend/ ./

# Build the application
RUN npm run build

# Expose port (Railway will set PORT env variable)
EXPOSE ${PORT:-5000}

# Start the application
CMD ["npm", "run", "start:prod"]


