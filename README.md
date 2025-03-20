# Cypress-POM-Ready-To-Use (2024 Edition)

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

## Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use
cd Cypress-POM-Ready-To-Use
npm install
```

2. **Run Tests**
```bash
npm run test:ui          # Run UI tests
npm run test:api         # Run API tests
npm run test:parallel    # Run all tests in parallel
npm run test:ci         # Run tests in CI mode
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

1. **Use Built-in Commands**
```typescript
// cypress/e2e/api/users.cy.ts
describe('Users API', () => {
    it('should create a new user', () => {
        cy.request({
            method: 'POST',
            url: '/api/users',
            body: {
                name: 'Test User',
                role: 'QA'
            }
        }).then(response => {
            expect(response.status).to.eq(201)
        })
    })
})
```

### Best Practices

1. **Selectors**
   - Use data-testid attributes: `[data-testid="login-button"]`
   - Store selectors in page objects
   - Use meaningful selector names

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
