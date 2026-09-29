# Use the current Cypress browser image with Node.js and Chrome preinstalled
FROM cypress/included:15.14.2

# Set working directory
WORKDIR /e2e

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Verify Cypress installation
RUN npx cypress verify

# Set environment variables
ENV CI=true
ENV NODE_ENV=test

# Expose port for potential debugging
EXPOSE 8080

# Default command to run tests
CMD ["npm", "run", "test:ci"]
