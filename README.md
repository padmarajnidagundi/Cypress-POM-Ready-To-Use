# Cypress-POM-Ready-To-Use (Updated 2024)

A modern TypeScript-based Page Object Model implementation for Cypress.io with enhanced features and best practices.

## Features

- TypeScript support
- Base Page Object pattern
- Reusable components
- Custom commands
- Environment configuration
- API testing support
- Parallel test execution
- Comprehensive reporting

## Project Structure
```
Cypress-POM-Ready-To-Use/
├── cypress/
│   ├── e2e/                    # Test files
│   ├── pageObjects/            # Page Object classes
│   │   ├── basePage.js         # Base page object with common methods
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── [feature]Page.js   # Feature-specific page objects
│   ├── support/
│   │   ├── commands.js        # Custom commands
│   │   ├── e2e.js            # Test configuration
│   │   └── index.d.ts        # TypeScript definitions
│   └── fixtures/              # Test data
├── cypress.config.js          # Cypress configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## Getting Started

1. **Installation**
```bash
npm install
npm run cypress:install
```

2. **Running Tests**
```bash
# Open Cypress Test Runner
npm run test:open

# Run tests headlessly
npm run test:ci

# Run specific test file
npx cypress run --spec "cypress/e2e/your-test.cy.js"
```

## Page Object Model Structure

### Base Page Object
```javascript
class BasePage {
    constructor() {
        this.baseUrl = Cypress.env('exampleUrl')
    }

    visit(path = '') {
        cy.visit(`${this.baseUrl}${path}`)
    }

    getElement(selector) {
        return cy.get(selector)
    }

    getByTestId(testId) {
        return cy.get(`[data-testid="${testId}"]`)
    }
}
```

### Feature Page Object Example
```javascript
import BasePage from './basePage'

class LoginPage extends BasePage {
    constructor() {
        super()
        this.selectors = {
            emailInput: 'input[type="email"]',
            passwordInput: 'input[type="password"]'
        }
    }

    login(email, password) {
        this.getElement(this.selectors.emailInput).type(email)
        this.getElement(this.selectors.passwordInput).type(password)
    }
}
```

### Test Example
```javascript
import LoginPage from '../pageObjects/loginPage'

describe('Login Tests', () => {
    const loginPage = new LoginPage()

    beforeEach(() => {
        loginPage.visit('/login')
    })

    it('should login successfully', () => {
        loginPage.login('user@example.com', 'password')
        loginPage.verifySuccessfulLogin()
    })
})
```

## Best Practices

1. **Selectors**
   - Use data-testid attributes
   - Store selectors in page objects
   - Avoid hardcoding selectors in tests

2. **Page Objects**
   - Extend BasePage for common functionality
   - Use TypeScript interfaces
   - Keep methods focused and reusable

3. **Tests**
   - Use before/beforeEach for setup
   - Keep tests independent
   - Use custom commands for repetitive actions

## Environment Configuration

Configure different environments in cypress.config.js:
```javascript
env: {
    apiUrl: 'https://reqres.in',
    reactAppUrl: 'https://react-redux.realworld.io',
    exampleUrl: 'https://example.cypress.io'
}
```

## Scripts

- `npm run test` - Run all tests
- `npm run test:open` - Open Cypress Test Runner
- `npm run test:ci` - Run tests in CI mode
- `npm run lint` - Run ESLint
- `npm run prettier` - Format code

## Contact

For more information or support:
- Email: [padmaraj.nidagundi@gmail.com](mailto:padmaraj.nidagundi@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/padmarajn/](https://www.linkedin.com/in/padmarajn/)
- GitHub: [https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use](https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use)
