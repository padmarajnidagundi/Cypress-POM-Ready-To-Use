# Cypress-POM-Ready-To-Use (2025 Edition)

A production-ready Cypress automation framework with Page Object Model, supporting both UI and API testing.

## Key Features.

- TypeScript support with type definitions
- Page Object Model implementation
- API testing capabilities with custom commands
- Parallel test execution
- CI/CD ready with GitHub Actions
- Environment-based configuration
- Comprehensive reporting
- Built-in retry mechanisms for flaky tests

## Framework Comparison

### Cypress Advantages & Disadvantages

| Advantages | Disadvantages |
|------------|---------------|
| ✅ Real-time reload and time travel debugging | ❌ Single browser tab execution |
| ✅ Automatic waiting and retry mechanisms | ❌ Limited cross-domain testing |
| ✅ Consistent and reliable tests | ❌ No support for multiple browser windows |
| ✅ Built-in screenshots and videos | ❌ Limited iframe support |
| ✅ Excellent developer experience and debugging | ❌ No native mobile testing support |
| ✅ Modern JavaScript stack and syntax | ❌ Same-origin policy limitations |
| ✅ Rich ecosystem of plugins | ❌ CPU/Memory intensive for large suites |
| ✅ Comprehensive documentation | ❌ Limited support for file downloads |
| ✅ Active community support | ❌ Requires JavaScript knowledge |
| ✅ Built-in network stubbing | ❌ Browser support limited to Chrome-family |
| ✅ Native access to browser APIs | ❌ Not suitable for native mobile apps |
| ✅ Simple setup and configuration | ❌ Complex iframe handling |
| ✅ API testing capabilities | ❌ Limited parallel testing in open source |
| ✅ TypeScript support | ❌ Higher resource usage than Selenium |
| ✅ Command chaining for better readability | ❌ Learning curve for non-JS developers |

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

## Quick Start

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

If you encounter the error `'cypress' is not recognized as an internal or external command`, follow these steps:

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

### Writing API Tests

Our framework supports comprehensive API testing across multiple categories:

1. **Unit Tests**
```javascript
describe('[Unit] User API Operations', () => {
  it('[Unit] should retrieve user with valid data structure', () => {
    cy.apiRequest('GET', '/users/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
    })
  })
})
```

2. **Integration Tests**
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

3. **Performance Tests**
```javascript
describe('[Performance] API Response Times', () => {
  it('[Performance] should meet response time SLA', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.duration).to.be.lessThan(1000)
    })
  })
})
```

4. **Security Tests**
```javascript
describe('[Security] API Authentication', () => {
  it('[Security] should enforce authentication', () => {
    cy.apiRequest('GET', '/protected', {
      headers: { 'Authorization': 'Bearer invalid_token' }
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})
```

5. **Validation Tests**
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

6. **Interoperability Tests**
```javascript
describe('[Interop] API Compatibility', () => {
  it('[Interop] should support multiple formats', () => {
    cy.apiRequest('GET', '/users', {
      headers: { 'Accept': 'application/json' }
    }).then((response) => {
      expect(response.headers['content-type']).to.include('application/json')
    })
  })
})
```

7. **Mock Tests**
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

### API Test Organization
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

### Custom API Commands

Our framework provides built-in commands for API testing:

```javascript
// Make API requests with default configuration
cy.apiRequest(method, path, options)

// Example usage
cy.apiRequest('POST', '/users', {
  body: { name: 'Test User' },
  headers: { 'Authorization': 'Bearer token' }
})
```

### API Testing Best Practices

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

### Best Practices

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

This framework uses Mochawesome for comprehensive HTML reporting. Get detailed insights with screenshots, videos, and test execution metrics.

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

4. **Reporter Configuration**
Add these options to `cypress.config.js`:
```javascript
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,                    // Enable charts
    reportPageTitle: 'Test Report',  // Custom title
    embeddedScreenshots: true,       // Inline screenshots
    inlineAssets: true,             // Inline assets
    saveAllAttempts: false,         // Save only failures
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

## Debugging Tips

1. **Time Travel**
   - Use Cypress Time Travel feature
   - Check screenshots in `cypress/screenshots`
   - Review videos in `cypress/videos`

2. **Logging**
   - Use `cy.log()` for debug information
   - Enable Chrome DevTools in interactive mode

## Contributing

We welcome contributions that help improve this Cypress Page Object Model framework! Here's how you can contribute:

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
   const { defineConfig } = require("cypress");
   const createBundler = require("@cypress/browserify-preprocessor");

   module.exports = defineConfig({
     viewportWidth: 1920,
     viewportHeight: 1080,
     watchForFileChanges: false,
     // ... other configurations
   });
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
