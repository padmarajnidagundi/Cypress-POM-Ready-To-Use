# Cypress Page Object Model Framework 2026 | Complete E2E Testing Guide

**Production-Ready Cypress Automation Framework with TypeScript, API Testing & CI/CD Integration**

> **Last Updated:** January 17, 2026 | **Version:** 2.0.0 | **Maintained by QA Professionals**

[![Node.js CI](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/actions/workflows/node.js.yml/badge.svg)](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/actions/workflows/node.js.yml)
[![npm version](https://img.shields.io/npm/v/cypress-page-object-model.svg)](https://www.npmjs.com/package/cypress-page-object-model)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start Guide](#quick-start-guide)
- [Framework Architecture](#framework-architecture)
- [Testing Capabilities](#testing-capabilities)
  - [UI Testing](#ui-testing)
  - [API Testing](#api-testing)
  - [Accessibility Testing](#accessibility-testing)
  - [Visual Regression Testing](#visual-regression-testing)
- [Chat Mode Documentation](#chat-mode-documentation)
- [Test Reporting](#test-reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Support & Community](#support--community)
- [License](#license)

## Overview

A **battle-tested, enterprise-grade Cypress automation framework** built with TypeScript and the
Page Object Model design pattern. This framework provides everything you need for modern web
application testing including UI testing, API testing, accessibility validation, and comprehensive
reporting.

**Perfect for:** QA Engineers, Test Automation Engineers, DevOps Teams, and Development Teams
looking to implement robust end-to-end testing.

### Why This Framework?

- ✅ **Production-Ready**: Used in real-world projects with proven reliability
- ✅ **Best Practices Built-In**: Follows industry standards and design patterns
- ✅ **Comprehensive Documentation**: Extensive guides and examples
- ✅ **Active Maintenance**: Regular updates and security patches
- ✅ **Community Support**: Growing community of contributors

## Key Features

- TypeScript support with type definitions
- ChatGPT interface testing suite
- Comprehensive accessibility testing
- Page Object Model implementation
- API testing capabilities with custom commands
- Parallel test execution
- CI/CD ready with GitHub Actions
- Environment-based configuration
- Comprehensive reporting
- Built-in retry mechanisms for flaky tests

## Framework Comparison

### Cypress Advantages & Disadvantages

| Advantages                                      | Disadvantages                               |
| ----------------------------------------------- | ------------------------------------------- |
| ✅ Real-time reload and time travel debugging   | ❌ Single browser tab execution             |
| ✅ Automatic waiting and retry mechanisms       | ❌ Limited cross-domain testing             |
| ✅ Consistent and reliable tests                | ❌ No support for multiple browser windows  |
| ✅ Built-in screenshots and videos              | ❌ Limited iframe support                   |
| ✅ Excellent developer experience and debugging | ❌ No native mobile testing support         |
| ✅ Modern JavaScript stack and syntax           | ❌ Same-origin policy limitations           |
| ✅ Rich ecosystem of plugins                    | ❌ CPU/Memory intensive for large suites    |
| ✅ Comprehensive documentation                  | ❌ Limited support for file downloads       |
| ✅ Active community support                     | ❌ Requires JavaScript knowledge            |
| ✅ Built-in network stubbing                    | ❌ Browser support limited to Chrome-family |
| ✅ Native access to browser APIs                | ❌ Not suitable for native mobile apps      |
| ✅ Simple setup and configuration               | ❌ Complex iframe handling                  |
| ✅ API testing capabilities                     | ❌ Limited parallel testing in open source  |
| ✅ TypeScript support                           | ❌ Higher resource usage than Selenium      |
| ✅ Command chaining for better readability      | ❌ Learning curve for non-JS developers     |

### When to Choose Cypress

1. **Best For:**

   - Modern web applications
   - Single page applications (SPAs)
   - Real-time testing feedback
   - JavaScript/TypeScript projects
   - E2E and Component testing
   - API testing

2. **Not Ideal For:**
   - Native mobile testing
   - Multi-tab scenarios
   - Complex iframe operations
   - Cross-browser testing at scale
   - Non-JavaScript applications
   - Limited resource environments

## Quick Start Guide

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Git**: For version control
- **Operating System**: Windows, macOS, or Linux

### Installation Steps

1. **Clone and Install**

```bash
git clone https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use
cd Cypress-POM-Ready-To-Use
```

2. **Setup Project**

```bash
npm run presetup     # Install all dependencies
npm run setup       # Install Cypress
npm run verify      # Verify Cypress installation
```

3. **Open Cypress**

```bash
npm run cypress:open  # Open Cypress Test Runner
```

4. **Run Tests**

```bash
npm run test:ui          # Run UI tests
npm run test:api         # Run API tests
npm run test:parallel    # Run all tests in parallel
npm run test:ci         # Run tests in CI mode
```

### Troubleshooting Installation

If you encounter the error `'cypress' is not recognized as an internal or external command`, follow
these steps:

1. Clear npm cache and node_modules:

```bash
npm cache clean --force
rm -rf node_modules
rm -rf package-lock.json
```

2. Reinstall dependencies:

```bash
npm run presetup
```

3. Verify installation:

```bash
npm run verify
```

4. Test Cypress:

```bash
npm run cypress:open
```

## For QA Engineers

### Writing UI Tests

1. **Create Page Objects**

```typescript
// cypress/pageObjects/pages/loginPage.ts
import BasePage from '../basePage'

class LoginPage extends BasePage {
  private selectors = {
    username: '#username',
    password: '#password',
    submitBtn: '[data-testid="login-btn"]'
  }

  login(username: string, password: string) {
    this.getElement(this.selectors.username).type(username)
    this.getElement(this.selectors.password).type(password)
    this.getElement(this.selectors.submitBtn).click()
  }
}
```

2. **Write Tests**

```typescript
// cypress/e2e/ui/login.cy.ts
import LoginPage from '../../pageObjects/pages/loginPage'

describe('Login Tests', () => {
  const loginPage = new LoginPage()

  beforeEach(() => {
    loginPage.visit('/login')
  })

  it('should login successfully', () => {
    loginPage.login('testuser', 'password')
    // assertions
  })
})
```

### API Testing

Our framework supports comprehensive API testing across multiple categories:

#### Test Categories

1. **Unit Tests** - Basic API endpoint validation

```javascript
describe('[Unit] User API Operations', () => {
  it('[Unit] should retrieve user with valid data structure', () => {
    cy.apiRequest('GET', '/users/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.all.keys(
        'id',
        'email',
        'first_name',
        'last_name',
        'avatar'
      )
    })
  })
})
```

2. **Integration Tests** - End-to-end API workflows

```javascript
describe('[Integration] User Management Workflow', () => {
  it('[Integration] should perform complete user CRUD operations', () => {
    cy.apiRequest('POST', '/users', {
      body: { name: 'Test User', job: 'QA Engineer' }
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })
})
```

3. **Performance Tests** - Response time validation

```javascript
describe('[Performance] API Response Times', () => {
  it('[Performance] should meet response time SLA', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.duration).to.be.lessThan(1000)
    })
  })
})
```

4. **Security Tests** - Authentication & authorization

```javascript
describe('[Security] API Authentication', () => {
  it('[Security] should enforce authentication', () => {
    cy.apiRequest('GET', '/protected', {
      headers: { Authorization: 'Bearer invalid_token' }
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})
```

5. **Validation Tests** - Input validation checks

```javascript
describe('[Validation] API Input Validation', () => {
  it('[Validation] should enforce required fields', () => {
    cy.apiRequest('POST', '/register', {
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })
})
```

6. **Interoperability Tests** - Cross-platform compatibility

```javascript
describe('[Interop] API Compatibility', () => {
  it('[Interop] should support multiple formats', () => {
    cy.apiRequest('GET', '/users', {
      headers: { Accept: 'application/json' }
    }).then((response) => {
      expect(response.headers['content-type']).to.include('application/json')
    })
  })
})
```

7. **Mock Tests** - Response stubbing & mocking

```javascript
describe('[Mock] API Response Mocking', () => {
  it('[Mock] should handle mocked responses', () => {
    cy.intercept('GET', '/users', {
      fixture: 'users.json'
    }).as('getUsers')

    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      cy.wait('@getUsers')
    })
  })
})
```

#### API Test Organization Structure

```
cypress/e2e/api/
├── unit-tests/           # Basic API operations
├── integration-tests/    # End-to-end workflows
├── performance-tests/    # Response times & load
├── security-tests/      # Auth & security checks
├── validation-tests/    # Input validation
├── mock-tests/         # Response mocking & stubbing
└── interop-tests/      # Compatibility tests
```

#### Custom API Commands

Our framework provides built-in commands for API testing:

```javascript
// Make API requests with default configuration
cy.apiRequest(method, path, options)

// Example usage
cy.apiRequest('POST', '/users', {
  body: { name: 'Test User' },
  headers: { Authorization: 'Bearer token' }
})
```

#### API Testing Best Practices

1. **Test Structure**

   - Use descriptive category prefixes: [Unit], [Integration], etc.
   - Group related tests in appropriate folders
   - Follow the single responsibility principle

2. **Assertions**

   - Verify status codes and response structure
   - Check response times for performance
   - Validate security headers and tokens
   - Test edge cases and error conditions

3. **Data Management**
   - Use fixtures for test data
   - Clean up test data after tests
   - Handle environment-specific configurations

### Accessibility Testing

Built-in accessibility testing with cypress-axe ensures your application meets WCAG standards:

```javascript
describe('Accessibility Tests', () => {
  it('should pass accessibility checks', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })
})
```

**Run accessibility tests:**

```bash
npm run test:a11y
```

### Visual Regression Testing

Automated visual comparison to catch unintended UI changes:

```javascript
describe('Visual Tests', () => {
  it('should match homepage screenshot', () => {
    cy.visit('/')
    cy.matchImageSnapshot('homepage')
  })
})
```

**Run visual tests:**

```bash
npm run test:visual
```

## Chat Mode Documentation

### What is Chat Mode?

The `cypress/chatmode/` folder contains **professional testing templates and comprehensive guides**
designed to help QA engineers and teams standardize their testing documentation and follow industry
best practices.

### Data Management

**Test Data Generators:**

````javascript
import { TestDataGenerator } from '../support/helpers/testDataGenerator'

// Generate random user
const user = TestDataGenerator.genera

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test:ci'
            }
        }
    }
}
````

### Test Reporting

This framework uses Mochawesome for comprehensive HTML reporting. Get detailed insights with
screenshots, videos, and test execution metrics.

1. **Available Report Commands**

```bash
npm run report:clean     # Clean previous reports
npm run report:merge     # Merge multiple report JSONs
npm run report:generate  # Generate HTML from JSON
npm run test:report      # Full test execution with reports
```

2. **Report Features**

   - Interactive HTML dashboard
   - Test execution timeline
   - Suite and test-level statistics
   - Failure screenshots embedded in report
   - Test execution videos
   - Performance metrics
   - Filter and search capabilities
   - Responsive design for mobile viewing

3. **Report Structure**

```
cypress/reports/
├── html/               # HTML reports
│   ├── assets/        # Screenshots, videos
│   ├── report.html    # Main report
│   └── report.json    # Combined results
└── json/              # Individual test JSONs
```

4. **Reporter Configuration** Add these options to `cypress.config.js`:

```javascript
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true, // Enable charts
    reportPageTitle: 'Test Report', // Custom title
    embeddedScreenshots: true, // Inline screenshots
    inlineAssets: true, // Inline assets
    saveAllAttempts: false, // Save only failures
    reportDir: 'cypress/reports/html',
    overwrite: false,
    html: true,
    json: true
  }
})
```

5. **Viewing Reports**

   - Open `cypress/reports/html/report.html` in any browser
   - Reports are self-contained and can be shared
   - Support offline viewing
   - Can be hosted on any static server

6. **CI/CD Integration**

```yaml
- name: Generate Test Report
  if: always()
  run: npm run test:report

- name: Upload Test Report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: cypress/reports/html
```

## Advanced Features

### Visual Regression Testing

The framework includes visual regression testing capabilities:

```javascript
// Visual regression test example
describe('Visual Tests', () => {
  it('should match homepage screenshot', () => {
    cy.visit('/')
    cy.matchImageSnapshot('homepage')
  })
})
```

Configuration in cypress.config.js:

- Visual regression path: `cypress/snapshots`
- Visual threshold: 0.1

Run visual tests:

```bash
npm run test:visual
```

### Accessibility Testing

Built-in accessibility testing with cypress-axe:

```javascript
describe('Accessibility Tests', () => {
  it('should pass accessibility checks', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })
})
```

Run accessibility tests:

```bash
npm run test:a11y
```

### Network Stubbing

Enhanced network mocking capabilities:

```javascript
// Mock REST API
cy.mockNetworkResponse('GET', '/api/users', { users: [] })

// Mock GraphQL
cy.mockGraphQL('GetUsers', { data: { users: [] } })
```

### Test Data Management

Factory pattern for test data generation:

```javascript
import UserFactory from '../support/factories/userFactory'

describe('User Tests', () => {
  it('should create user', () => {
    const user = UserFactory.generate()
    // Use generated user data in tests
  })

  it('should create multiple users', () => {
    const users = UserFactory.generateMany(3)
    // Use generated users data in tests
  })
})
```

## Additional Dependencies

New testing capabilities are provided by:

```json
{
  "cypress-image-snapshot": "^4.0.1",
  "cypress-axe": "^1.7.0",
  "@testing-library/cypress": "^10.0.2",
  "cypress-real-events": "^1.14.0"
}
```

## Debugging Tips

1. **Time Travel**

   - Use Cypress Time Travel feature
   - Check screenshots in `cypress/screenshots`
   - Review videos in `cypress/videos`

2. **Logging**

   - Use `cy.log()` for debug information
   - Enable Chrome DevTools in interactive mode

3. **Interactive Debugging**

```javascript
// Pause test execution
cy.pause()

// Debug specific command
cy.get('button').debug()

// Log variables
cy.log('User data:', user)
```

## Contributing

We welcome contributions! This project follows industry best practices and is maintained by
experienced QA professionals.teUser()

// Generate email const email = TestDataGenerator.generateEmail()

// Generate password const password = TestDataGenerator.generatePassword(16, true)

````

**Assertion Helpers:**

```javascript
import AssertionHelpers from '../support/helpers/assertionHelpers'

// Assert API response
AssertionHelpers.assertApiResponse(response, 200, ['id', 'name', 'email'])

// Assert element state
AssertionHelpers.assertElementState('[data-testid="button"]', {
  visible: true,
  enabled: true,
  text: 'Submit'
})
````

## Troubleshooting

### Common Issues & Solutions

#### 1. Installation Problems & Guides

#### 1. Test Case Template (`test-case-template.md`)

A standardized template for documenting test cases including:

- Test ID and priority
- Test type classification
- Prerequisites and setup
- Detailed test steps
- Expected vs actual results
- Test data and environment info
- Status tracking

**Usage:**

```bash
# Copy template for new test case
cp cypress/chatmode/test-case-template.md docs/test-cases/TC-001.md
```

#### 2. Bug Report Template (`bug-report-template.md`)

Comprehensive bug reporting format with:

- Severity and priority classification
- Environment details
- Reproduction steps
- Expected vs actual behavior
- Screenshots and console errors
- Impact assessment

**Usage:**

```bash
# Create new bug report
cp cypress/chatmode/bug-report-template.md docs/bugs/BUG-001.md
```

#### 3. Test Execution Report (`test-execution-report.md`)

Professional test execution summary including:

- Test statistics and metrics
- Pass/fail breakdown by category
- Performance metrics
- Defect summary
- Risk assessment
- Recommendations

**Usage:** Use this template to generate weekly/sprint test reports for stakeholders.

#### 4. API Testing Checklist (`api-testing-checklist.md`)

Complete API testing checklist covering:

- Functional testing
- Error handling (4xx, 5xx)
- Security testing
- Performance validation
- Data validation
- Edge cases

**Usage:** Reference during API test planning and execution to ensure comprehensive coverage.

#### 5. UI Testing Best Practices (`ui-testing-best-practices.md`)

In-depth guide including:

- Test design principles
- Selector best practices
- Assertion strategies
- Waiting mechanisms
- Common pitfalls
- Debugging techniques

**Usage:** Share with team members and reference during code reviews.

### How to Use Chat Mode Files

#### For Individual QA Engineers:

1. **Test Planning Phase:**

   ```bash
   # Review best practices
   cat cypress/chatmode/ui-testing-best-practices.md
   cat cypress/chatmode/api-testing-checklist.md
   ```

2. **Test Execution:**

   ```bash
   # Document your tests
   cp cypress/chatmode/test-case-template.md my-test-cases/TC-LOGIN-001.md
   ```

3. **Bug Reporting:**
   ```bash
   # Report issues using standard format
   cp cypress/chatmode/bug-report-template.md bugs/BUG-PAYMENT-001.md
   ```

#### For QA Teams:

1. **Onboarding New Team Members:**

   - Share the `ui-testing-best-practices.md` as training material
   - Use templates to standardize documentation
   - Reference during code reviews

2. **Sprint Planning:**

   - Use `api-testing-checklist.md` for test coverage planning
   - Estimate testing effort using templates
   - Create test cases from templates

3. **Sprint Reviews:**
   - Generate reports using `test-execution-report.md`
   - Present standardized metrics to stakeholders
   - Track quality trends over time

#### For Test Automation Projects:

```bash
# Set up documentation structure
mkdir -p docs/{test-cases,bugs,reports}

# Copy templates
cp cypress/chatmode/test-case-template.md docs/test-cases/
cp cypress/chatmode/bug-report-template.md docs/bugs/
cp cypress/chatmode/test-execution-report.md docs/reports/

# Create your first documented test case
cp cypress/chatmode/test-case-template.md docs/test-cases/TC-001-user-login.md
```

### Integration with IDE/Chat Tools

The chat mode templates are designed to work with:

- **AI Code Assistants**: Copy templates into your AI assistant for context-aware test generation
- **Documentation Tools**: Import into Confluence, Notion, or other wikis
- **Version Control**: Track documentation changes alongside code
- **Code Reviews**: Reference during PR reviews for quality standards

### Customization

All templates are Markdown-based and fully customizable:

```bash
# Customize for your project
vim cypress/chatmode/test-case-template.md

# Add your own templates
touch cypress/chatmode/my-custom-template.md
```

## Test Reporting

### Mochawesome HTML Reports

This framework uses Mochawesome for comprehensive HTML reporting with embedded screenshots and
videos.

1. **Selectors**

   - Use data-testid attributes: `[data-testid="login-button"]`
   - Store selectors in page objects.
   - Use meaningful selector names.

2. **Test Organization**

```
cypress/
├── e2e/
│   ├── api/           # API Tests
│   │   ├── users/
│   │   └── auth/
│   └── ui/            # UI Tests
│       ├── login/
│       └── dashboard/
├── pageObjects/
│   ├── components/    # Reusable components
│   └── pages/         # Page specific objects
└── fixtures/          # Test data
```

3. **Custom Commands**
   - Create reusable commands for common operations
   - Use TypeScript for better type checking
   - Document command parameters

### Environment Configuration

```javascript
// cypress.config.js
module.exports = {
  env: {
    apiUrl: 'https://api.dev.example.com',
    userRole: 'admin',
    featureFlags: {
      newUI: true
    }
  }
}
```

### Running Tests in CI

1. **GitHub Actions** (pre-configured)

```bash
npm run test:ci
```

2. **Jenkins** (sample configuration)

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test:ci'
            }
        }
    }
}
```

### Test Reporting

This framework uses Mochawesome for comprehensive HTML reporting. Get detailed insights with
screenshots, videos, and test execution metrics.

1. **Available Report Commands**

```bash
npm run report:clean     # Clean previous reports
npm run report:merge     # Merge multiple report JSONs
npm run report:generate  # Generate HTML from JSON
npm run test:report      # Full test execution with reports
```

2. **Report Features**

   - Interactive HTML dashboard
   - Test execution timeline
   - Suite and test-level statistics
   - Failure screenshots embedded in report
   - Test execution videos
   - Performance metrics
   - Filter and search capabilities
   - Responsive design for mobile viewing

3. **Report Structure**

```
cypress/reports/
├── html/               # HTML reports
│   ├── assets/        # Screenshots, videos
│   ├── report.html    # Main report
│   └── report.json    # Combined results
└── json/              # Individual test JSONs
```

4. **Reporter Configuration** Add these options to `cypress.config.js`:

```javascript
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true, // Enable charts
    reportPageTitle: 'Test Report', // Custom title
    embeddedScreenshots: true, // Inline screenshots
    inlineAssets: true, // Inline assets
    saveAllAttempts: false, // Save only failures
    reportDir: 'cypress/reports/html',
    overwrite: false,
    html: true,
    json: true
  }
})
```

5. **Viewing Reports**

   - Open `cypress/reports/html/report.html` in any browser
   - Reports are self-contained and can be shared
   - Support offline viewing
   - Can b & Community

### Get Help

- **Documentation**: Comprehensive guides in this README and `/cypress/chatmode/`
- **GitHub Issues**:
  [Report bugs or request features](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/issues)
- **Discussions**: Join our
  [GitHub Discussions](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/discussions)

### Community

- **Stars**: Star this repo if you find it useful
- **Fork**: Fork and customize for your needs
- **Contribute**: Submit PRs with improvements
- **Share**: Share with your QA community

## Changelog

### Version 2.0.0 (January 2026)

- ✨ Added ESLint 9 flat config support
- ✨ Integrated Husky 9 for pre-commit hooks
- ✨ Added comprehensive test helpers (data generators, assertions, retry logic)
- ✨ Created chatmode templates for documentation
- 📝 Enhanced README with E-E-A-T guidelines
- 🔧 Updated dependencies (cypress-axe, cypress-mochawesome-reporter)
- 🔧 Added dependabot configuration
- 🔧 Improved GitHub Actions workflow
- 📚 Added CONTRIBUTING.md

### Version 1.x

- Initial release with Page Object Model
- Basic UI and API testing support

## Frequently Asked Questions (FAQ)always()

run: npm run test:report

- name: Upload Test Report if: always() uses: actions/upload-artifact@v4 with: name: test-report
  path: cypress/reports/html

````

## Advanced Features

### Visual Regression Testing

The framework includes visual regression testing capabilities:

```javascript
// Visual regression test example
describe('Visual Tests', () => {
  it('should match homepage screenshot', () => {
    cy.visit('/')
    cy.matchImageSnapshot('homepage')
  })
})
````

Configuration in cypress.config.js:

- Visual regression path: `cypress/snapshots`
- Visual threshold: 0.1

Run visual tests:

```bash
npm run test:visual
```

### Accessibility Testing

Built-in accessibility testing with cypress-axe:

```javascript
describe('Accessibility Tests', () => {
  # Q: How do I use the chatmode templates?

**A:** The chaFree to use in personal and commercial projects

Copyright (c) 2026 Padmaraj Nidagundi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

## Keywords & Tags

**For SEO:** Cypress testing framework, Page Object Model, E2E testing, API testing automation, TypeScript test framework, CI/CD testing, accessibility testing, visual regression testing, test automation best practices, Cypress tutorial, QA automation framework, end-to-end testing, test reporting, Mochawesome reports, Cypress patterns

**For Developers:** #Cypress #Testing #Automation #QA #TypeScript #JavaScript #E2E #API #CI/CD #DevOps #PageObjectModel #TestAutomation #Accessibility #VisualTesting

---

**⭐ If this framework helped you, please star the repository!**

**🤝 Contributions welcome - See [CONTRIBUTING.md](CONTRIBUTING.md)**

**📢 Share with your QA community**

**A:** This framework provides:
- Page Object Model structure
- Pre-configured best practices
- Custom helper functions
- Comprehensive documentation
- CI/CD integration
- Professional templates
- Test data generators
- Enhanced reporting

### Q: Is this framework suitable for large projects?

**A:** Yes! This framework is designed for scalability with:
- Modular architecture
- Reusable components
- Parallel test execution
- Efficient data management
- Clear folder structure

## About the Author

**Padmaraj Nidagundi** - Senior QA Automation Engineer

With over 10+ years of experience in test automation and quality assurance, I've built this framework based on real-world enterprise projects. This repository represents industry best practices and battle-tested patterns used in production environments.

**Expertise:**
- Test Automation Architecture
- Cypress & Selenium Frameworks
- CI/CD Pipeline Integration
- API Testing & Performance Testing
- Accessibility & Security Testing

**Connect:**
- 💼 LinkedIn: [linkedin.com/in/padmarajn](https://www.linkedin.com/in/padmarajn/)
- 📧 Email: padmaraj.nidagundi@gmail.com
- 📦 npm: [npmjs.com/~padmarajnidagundi](https://www.npmjs.com/~padmarajnidagundi)
- 🐙 GitHub: [github.com/padmarajnidagundi](https://github.com/padmarajnidagundi)
npm run test:a11y
```

### Network Stubbing

Enhanced network mocking capabilities:

```javascript
// Mock REST API
cy.mockNetworkResponse('GET', '/api/users', { users: [] })

// Mock GraphQL
cy.mockGraphQL('GetUsers', { data: { users: [] } })
```

### Test Data Management

Factory pattern for test data generation:

```javascript
import UserFactory from '../support/factories/userFactory'

describe('User Tests', () => {
  it('should create user', () => {
    const user = UserFactory.generate()
    // Use generated user data in tests
  })

  it('should create multiple users', () => {
    const users = UserFactory.generateMany(3)
    // Use generated users data in tests
  })
})
```

## Additional Dependencies

New testing capabilities are provided by:

```json
{
  "cypress-image-snapshot": "^4.0.1",
  "cypress-axe": "^1.5.0",
  "@testing-library/cypress": "^10.0.1",
  "cypress-real-events": "^1.11.0",
  "@faker-js/faker": "^8.0.0"
}
```

## Debugging Tips

1. **Time Travel**

   - Use Cypress Time Travel feature
   - Check screenshots in `cypress/screenshots`
   - Review videos in `cypress/videos`

2. **Logging**
   - Use `cy.log()` for debug information
   - Enable Chrome DevTools in interactive mode

## Contributing

We welcome contributions that help improve this Cypress Page Object Model framework! Here's how you
can contribute:

### Types of Contributions

1. **Page Objects**

   - New page object implementations
   - Improvements to existing page objects
   - Utility functions for common actions

2. **Test Examples**

   - UI test examples
   - API test examples
   - Integration test patterns

3. **Documentation**
   - Usage examples
   - Best practices
   - Troubleshooting guides

### How to Contribute

1. **Fork and Clone**

   ```bash
   # Fork this repository on GitHub
   git clone https://github.com/YOUR_USERNAME/Cypress-POM-Ready-To-Use.git
   cd Cypress-POM-Ready-To-Use
   npm install
   ```

2. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**

   - Follow the existing code structure
   - Add tests for new features
   - Update documentation as needed

4. **Contribution Guidelines**

   - Use TypeScript for new files
   - Follow the page object pattern
   - Add JSDoc comments for methods
   - Include test cases for new features

   ```typescript
   /**
    * Example of a well-documented page object
    */
   class ExamplePage extends BasePage {
     private selectors = {
       submitButton: '[data-testid="submit"]'
     }

     /**
      * Submits the form with given data
      * @param {string} data - The data to submit
      * @returns {Cypress.Chainable}
      */
     submitForm(data: string) {
       return this.getElement(this.selectors.submitButton).click()
     }
   }
   ```

5. **Run Tests**

   ```bash
   npm run test        # Run all tests
   npm run lint        # Check code style
   npm run build       # Ensure build passes
   ```

6. **Submit PR**
   - Create a Pull Request against the `main` branch
   - Provide a clear description of changes
   - Reference any related issues
   - Wait for review and address feedback

### Directory Structure for Contributions

```
cypress/
├── e2e/                    # Add tests here
│   ├── api/               # API test examples
│   └── ui/                # UI test examples
├── pageObjects/           # Add page objects here
│   ├── components/        # Reusable components
│   └── pages/            # Page implementations
└── support/              # Add custom commands here
    └── commands/         # Custom command implementations
```

### Code Style Guide

1. **Naming Conventions**

   - Use PascalCase for page objects: `LoginPage.ts`
   - Use camelCase for methods: `submitForm()`
   - Use descriptive test names: `'should successfully submit form'`

2. **File Organization**

   - One page object per file
   - Group related tests in describe blocks
   - Keep selectors in a separate object

3. **Testing Standards**
   - Write atomic tests
   - Use meaningful assertions
   - Avoid hard-coded waits

### Need Help?

- Check existing [issues](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use/issues)
- Join our [Discord community]
- Read our [documentation]

## Support

- Documentation: See `docs/` folder
- Issues: GitHub Issues
- Community: [Join our Discord]

## FAQ

### Common Configuration Issues

1. **Error with `cypress.config.js`**

   ```javascript
   const { defineConfig } = require('cypress')
   ```

   **Solution:** Ensure proper configuration setup:

   - Install browserify preprocessor: `npm install @cypress/browserify-preprocessor --save-dev`
   - Use the complete configuration:

   ```javascript
   const { defineConfig } = require('cypress')
   const createBundler = require('@cypress/browserify-preprocessor')

   module.exports = defineConfig({
     viewportWidth: 1920,
     viewportHeight: 1080,
     watchForFileChanges: false
     // ... other configurations
   })
   ```

2. **TypeScript Support**

   - Ensure these dependencies are installed:

   ```json
   {
     "devDependencies": {
       "@cypress/browserify-preprocessor": "^3.0.2",
       "@types/node": "^20.11.16",
       "typescript": "^5.3.3"
     }
   }
   ```

3. **Running Tests**

   - For UI tests: `npm run test:ui`
   - For API tests: `npm run test:api`
   - For parallel execution: `npm run test:parallel`

4. **Environment Configuration**
   - Default environments are:
     - API URL: `https://reqres.in`
     - React App URL: `https://react-redux.realworld.io`
     - Example URL: `https://example.cypress.io`

### Best Practices

1. **Page Object Model**

   - Keep selectors in page objects
   - Use data-testid attributes
   - Implement base page for common functions

2. **Test Organization**

   - API tests in `cypress/e2e/api/`
   - UI tests in `cypress/e2e/ui/`
   - Integration tests in `cypress/e2e/integration/`

3. **Performance**
   - Use `cy.session()` for login state
   - Enable retries in CI mode
   - Implement proper timeouts

## License

MIT License - feel free to use in your projects

## Contact

- Author: Padmaraj Nidagundi
- Email: padmaraj.nidagundi@gmail.com
- LinkedIn: https://www.linkedin.com/in/padmarajn/
- NpmJs: https://www.npmjs.com/package/cypress-page-object-model
- GitHub: https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use

## MCP (Model Context Protocol) Integration

MCP (Model Context Protocol) is an emerging standard for context-aware automation and test
orchestration. The protocol enables advanced test scenarios, dynamic context switching, and improved
interoperability between test suites and external systems.

### Planned MCP Features for This Repo

- **Context-aware Page Objects:** Enhance page objects to support dynamic context switching using
  MCP.
- **Test Orchestration:** Integrate MCP for orchestrating complex test flows across UI, API, and
  accessibility layers.
- **External System Integration:** Enable seamless communication with external systems (e.g., CI/CD,
  reporting tools) via MCP endpoints.
- **Custom MCP Commands:** Provide Cypress custom commands for interacting with MCP contexts and
  models.
- **Documentation & Examples:** Add guides and examples for using MCP in real-world test scenarios.

> **Status:** MCP integration is planned for upcoming releases. Contributions and feedback are
> welcome!
