# Cypress-POM-Ready-To-Use (2024 Edition)

A production-ready Cypress automation framework with Page Object Model, supporting both UI and API testing.

## Key Features

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

1. Fork the repository
2. Create your feature branch
3. Add tests for new features
4. Submit a pull request

## Support

- Documentation: See `docs/` folder
- Issues: GitHub Issues
- Community: [Join our Discord]

## License

MIT License - feel free to use in your projects

## Contact

- Author: Padmaraj Nidagundi
- Email: padmaraj.nidagundi@gmail.com
- LinkedIn: https://www.linkedin.com/in/padmarajn/
