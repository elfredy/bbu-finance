# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Railway will set PORT env variable)
EXPOSE ${PORT:-5000}

# Start the application
CMD ["npm", "run", "start:prod"]

