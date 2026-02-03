# Docker Setup Guide for Cypress POM Framework

This guide provides detailed instructions for running the Cypress Page Object Model framework in
Docker containers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Configuration](#docker-configuration)
- [Common Use Cases](#common-use-cases)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+ (optional but recommended)
- 4GB+ available RAM

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Run all tests
docker-compose up --build cypress

# Run tests in background
docker-compose up -d cypress

# View test reports in browser
docker-compose up cypress-reports
# Then open http://localhost:8080 in your browser

# Stop all services
docker-compose down

# Clean up volumes
docker-compose down -v
```

### Using Docker CLI

```bash
# Build the image
docker build -t cypress-pom-tests .

# Run tests
docker run --rm cypress-pom-tests

# Run with reports output
docker run --rm \
  -v $(pwd)/cypress/reports:/e2e/cypress/reports \
  -v $(pwd)/mochawesome-report:/e2e/mochawesome-report \
  cypress-pom-tests
```

## Docker Configuration

### Dockerfile

The Dockerfile uses the official Cypress included image with Chrome browser pre-installed:

- **Base Image**: `cypress/included:13.17.0`
- **Node.js**: Pre-installed in Cypress image
- **Browsers**: Chrome (included)
- **Working Directory**: `/e2e`

### Docker Compose Services

#### 1. Cypress Test Runner

The main service that executes your Cypress tests:

```yaml
services:
  cypress:
    build: .
    volumes:
      - ./cypress:/e2e/cypress
      - ./cypress/reports:/e2e/cypress/reports
```

#### 2. Report Viewer

An nginx server to view test reports:

```yaml
services:
  cypress-reports:
    image: nginx:alpine
    ports:
      - '8080:80'
    volumes:
      - ./cypress/reports/html:/usr/share/nginx/html
```

## Common Use Cases

### 1. Run Specific Test Suite

```bash
# Run only API tests
docker run --rm cypress-pom-tests npm run test:api

# Run only UI tests
docker run --rm cypress-pom-tests npm run test:ui

# Run specific spec file
docker run --rm cypress-pom-tests \
  npx cypress run --spec "cypress/e2e/api/users.cy.js"
```

### 2. Run Tests with Custom Browser

```bash
# Chrome (default)
docker run --rm cypress-pom-tests npm run test -- --browser chrome

# Electron (headless)
docker run --rm cypress-pom-tests npm run test -- --browser electron
```

### 3. Development Mode with Live Reload

```bash
# Mount your local code and watch for changes
docker-compose up

# The volumes are already configured in docker-compose.yml:
# - ./cypress:/e2e/cypress
# - ./cypress.config.js:/e2e/cypress.config.js
```

### 4. Run Tests with Environment Variables

```bash
# Single environment variable
docker run --rm \
  -e CYPRESS_BASE_URL=https://staging.example.com \
  cypress-pom-tests

# Multiple environment variables
docker run --rm \
  -e CYPRESS_BASE_URL=https://staging.example.com \
  -e CYPRESS_API_URL=https://api.staging.example.com \
  -e CYPRESS_VIDEO=false \
  cypress-pom-tests

# Using .env file
docker run --rm --env-file .env cypress-pom-tests
```

### 5. Parallel Test Execution

```bash
# Run tests in parallel (requires Cypress Dashboard)
docker run --rm \
  -e CYPRESS_RECORD_KEY=your-key \
  cypress-pom-tests npm run test:parallel
```

### 6. Extract Test Artifacts

```bash
# Reports
docker run --rm \
  -v $(pwd)/reports:/e2e/cypress/reports \
  cypress-pom-tests

# Screenshots
docker run --rm \
  -v $(pwd)/screenshots:/e2e/cypress/screenshots \
  cypress-pom-tests

# Videos
docker run --rm \
  -v $(pwd)/videos:/e2e/cypress/videos \
  cypress-pom-tests
```

## Advanced Configuration

### Custom Dockerfile

Create a custom Dockerfile for specific needs:

```dockerfile
FROM cypress/included:13.17.0

WORKDIR /e2e

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    vim \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# Custom environment variables
ENV CYPRESS_BASE_URL=https://your-app.com
ENV CYPRESS_VIDEO=true
ENV CYPRESS_SCREENSHOTS_FOLDER=/e2e/cypress/screenshots

CMD ["npm", "run", "test:ci"]
```

### Multi-Stage Build (Optimized)

For smaller image size:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM cypress/included:13.17.0
WORKDIR /e2e
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "test:ci"]
```

### Docker Compose Override

Create `docker-compose.override.yml` for local development:

```yaml
version: '3.8'

services:
  cypress:
    environment:
      - CYPRESS_BASE_URL=http://localhost:3000
      - DEBUG=cypress:*
    volumes:
      - ./cypress/videos:/e2e/cypress/videos
      - ./cypress/screenshots:/e2e/cypress/screenshots
```

### Network Configuration

Run tests against services in Docker network:

```yaml
version: '3.8'

services:
  app:
    image: your-app:latest
    ports:
      - '3000:3000'
    networks:
      - cypress-network

  cypress:
    build: .
    depends_on:
      - app
    environment:
      - CYPRESS_BASE_URL=http://app:3000
    networks:
      - cypress-network

networks:
  cypress-network:
    driver: bridge
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and run tests
        run: docker-compose up --build --abort-on-container-exit cypress

      - name: Upload test reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-reports
          path: cypress/reports
```

### GitLab CI

```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose up --build --abort-on-container-exit cypress
  artifacts:
    paths:
      - cypress/reports
    when: always
```

### Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'docker-compose up --build --abort-on-container-exit cypress'
            }
        }
    }
    post {
        always {
            publishHTML([
                reportDir: 'cypress/reports/html',
                reportFiles: 'index.html',
                reportName: 'Cypress Test Report'
            ])
        }
    }
}
```

### Azure DevOps

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: Docker@2
    inputs:
      command: 'build'
      Dockerfile: '**/Dockerfile'
      tags: 'cypress-pom-tests'

  - script: |
      docker run --rm \
        -v $(pwd)/cypress/reports:/e2e/cypress/reports \
        cypress-pom-tests
    displayName: 'Run Cypress Tests'

  - task: PublishTestResults@2
    inputs:
      testResultsFiles: 'cypress/reports/**/*.xml'
    condition: always()
```

## Troubleshooting

### Common Issues

#### 1. Permission Denied Errors

```bash
# Linux/Mac: Fix file permissions
sudo chown -R $(id -u):$(id -g) cypress/reports
sudo chown -R $(id -u):$(id -g) node_modules

# Or run with proper user
docker run --rm --user $(id -u):$(id -g) cypress-pom-tests
```

#### 2. Out of Memory

```bash
# Increase Docker memory limit
docker run --rm --memory=4g cypress-pom-tests

# Or in docker-compose.yml
services:
  cypress:
    mem_limit: 4g
```

#### 3. Slow Build Times

```bash
# Use build cache
docker-compose build --parallel

# Use buildkit
DOCKER_BUILDKIT=1 docker build -t cypress-pom-tests .
```

#### 4. Network Issues

```bash
# Use host network (Linux only)
docker run --rm --network=host cypress-pom-tests

# Check DNS
docker run --rm cypress-pom-tests nslookup google.com
```

#### 5. Video Recording Issues

```bash
# Disable video to save resources
docker run --rm -e CYPRESS_VIDEO=false cypress-pom-tests

# Or in cypress.config.js
video: false
```

### Debug Mode

```bash
# Enable Cypress debug logs
docker run --rm -e DEBUG=cypress:* cypress-pom-tests

# Interactive shell for debugging
docker run --rm -it cypress-pom-tests /bin/bash

# Run with verbose npm logging
docker run --rm cypress-pom-tests npm run test:ci --verbose
```

### Performance Optimization

```bash
# Use npm ci instead of npm install (faster)
# Already configured in Dockerfile

# Disable unnecessary features
docker run --rm \
  -e CYPRESS_VIDEO=false \
  -e CYPRESS_SCREENSHOTS_ON_RUN_FAILURE=false \
  cypress-pom-tests

# Use smaller base image (if browsers not needed)
FROM cypress/base:18.12.1
```

## Best Practices

1. **Use Docker Compose** for easier configuration management
2. **Mount volumes** for reports and artifacts in development
3. **Set memory limits** to prevent system issues
4. **Use environment variables** for configuration
5. **Cache node_modules** using volumes in development
6. **Clean up** containers and volumes regularly
7. **Use specific versions** of base images (avoid `latest` tag)
8. **Run as non-root user** in production
9. **Keep Dockerfile simple** and well-documented
10. **Use .dockerignore** to reduce build context size

## Resources

- [Cypress Docker Documentation](https://docs.cypress.io/guides/guides/continuous-integration#Docker)
- [Cypress Docker Images](https://github.com/cypress-io/cypress-docker-images)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Support

For issues and questions:

- Open an issue on [GitHub](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/issues)
- Check existing
  [Docker-related issues](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/issues?q=docker)
