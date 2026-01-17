# UI Testing Best Practices

## General Guidelines

### Test Design Principles

1. **Write Independent Tests**

   - Each test should run in isolation
   - Don't depend on other tests' state
   - Clean up after each test

2. **Keep Tests Simple**

   - One test should verify one thing
   - Avoid complex conditional logic
   - Use descriptive test names

3. **Use Page Object Model**
   - Separate page structure from test logic
   - Reuse selectors across tests
   - Make tests more maintainable

### Example Structure

```javascript
describe('User Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should login with valid credentials', () => {
    loginPage.enterUsername('user@example.com')
    loginPage.enterPassword('password123')
    loginPage.submit()
    loginPage.verifySuccessMessage()
  })
})
```

## Selector Best Practices

### Recommended Selectors (Priority Order)

1. **Data Attributes** (Most Stable)

   ```javascript
   cy.get('[data-testid="submit-button"]')
   cy.get('[data-cy="user-menu"]')
   ```

2. **ARIA Attributes**

   ```javascript
   cy.get('[aria-label="Close dialog"]')
   cy.get('[role="navigation"]')
   ```

3. **Semantic HTML**
   ```javascript
   cy.get('button[type="submit"]')
   cy.get('nav a[href="/dashboard"]')
   ```

### Avoid These Selectors

- ❌ Class names (change frequently)
- ❌ IDs (might not be unique)
- ❌ nth-child (fragile)
- ❌ Complex CSS paths

## Assertions

### Use Appropriate Assertions

```javascript
// Visibility
cy.get('.modal').should('be.visible')
cy.get('.error').should('not.exist')

// Content
cy.get('h1').should('contain', 'Welcome')
cy.get('input').should('have.value', 'test')

// State
cy.get('button').should('be.disabled')
cy.get('checkbox').should('be.checked')

// Length
cy.get('li').should('have.length', 5)
cy.get('table tr').should('have.length.greaterThan', 0)
```

## Waiting Strategies

### Automatic Waiting (Preferred)

```javascript
// Cypress automatically waits
cy.get('.loading').should('not.exist')
cy.get('.content').should('be.visible')
```

### Manual Waits (Use Sparingly)

```javascript
// Wait for specific condition
cy.wait('@apiCall')

// Wait for element state
cy.get('button').should('be.enabled')

// Intercept network requests
cy.intercept('POST', '/api/users').as('createUser')
cy.wait('@createUser').its('response.statusCode').should('eq', 201)
```

## Common Pitfalls to Avoid

### 1. Don't Store State in Variables

```javascript
// ❌ Bad
const button = cy.get('button')
button.click()

// ✅ Good
cy.get('button').click()
```

### 2. Don't Mix Async/Await with Cypress

```javascript
// ❌ Bad
async function test() {
  await cy.get('button').click()
}

// ✅ Good
cy.get('button')
  .click()
  .then(() => {
    // Continue test
  })
```

### 3. Don't Test Third-Party Services

```javascript
// ❌ Bad - Testing external API
cy.request('https://api.external.com/data')

// ✅ Good - Stub external calls
cy.intercept('GET', '**/external/**', { fixture: 'data.json' })
```

## Test Organization

### Structure Your Tests

```
cypress/
  e2e/
    auth/
      login.cy.js
      register.cy.js
    dashboard/
      overview.cy.js
      settings.cy.js
  fixtures/
    users.json
  pageObjects/
    loginPage.js
    dashboardPage.js
  support/
    commands.js
```

## Performance Tips

1. **Reduce Test Time**

   - Use `cy.session()` for authentication
   - Stub slow API calls
   - Run tests in parallel

2. **Optimize Selectors**

   - Use specific selectors
   - Avoid scanning entire DOM
   - Cache complex queries

3. **Smart Test Execution**
   - Run smoke tests on every commit
   - Run full suite nightly
   - Group related tests

## Debugging

### Useful Commands

```javascript
// Pause test execution
cy.pause()

// Debug at specific point
cy.get('button').debug()

// Log to console
cy.log('Current state:', state)

// Take screenshot
cy.screenshot('error-state')
```

### Time Travel Debugging

- Use Cypress Test Runner
- Click on commands to see snapshots
- Inspect DOM at each step
- View network requests

## Accessibility Testing

```javascript
// Install cypress-axe
import 'cypress-axe'

it('should have no accessibility violations', () => {
  cy.visit('/')
  cy.injectAxe()
  cy.checkA11y()
})
```

## Visual Regression Testing

```javascript
// Install cypress-image-snapshot
cy.get('.component').matchImageSnapshot('component-name')
```

## Continuous Integration

### Best Practices

- Run tests on every PR
- Use parallelization
- Record videos on failure only
- Upload screenshots as artifacts
- Set appropriate timeouts

### Example CI Config

```yaml
- name: Run Cypress tests
  uses: cypress-io/github-action@v6
  with:
    browser: chrome
    headless: true
    record: true
```

## Test Data Management

```javascript
// Use fixtures
cy.fixture('users.json').then((users) => {
  cy.login(users.admin)
})

// Generate dynamic data
import { TestDataGenerator } from '../support/helpers'

const user = TestDataGenerator.generateUser()
cy.register(user)
```

## Checklist Before Commit

- [ ] All tests pass locally
- [ ] No hardcoded waits (`cy.wait(5000)`)
- [ ] Descriptive test names
- [ ] Page Objects updated
- [ ] No console.log() left in code
- [ ] Tests are independent
- [ ] Cleanup performed after tests
- [ ] Screenshots/videos reviewed for failures
