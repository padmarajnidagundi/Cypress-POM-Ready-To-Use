# Contributing to Cypress POM Ready To Use

Thank you for considering contributing to this project! This document outlines the process for
contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for
all contributors.

## Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Cypress-POM-Ready-To-Use.git
   cd Cypress-POM-Ready-To-Use
   ```

2. **Install dependencies**

   ```bash
   npm run presetup
   npm run setup
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Follow the ESLint and Prettier configurations
- Run `npm run lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Ensure all existing tests pass: `npm test`
- Follow the Page Object Model pattern
- Use descriptive test names
- Add appropriate assertions

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(api): add user authentication tests
fix(ui): resolve login button click issue
docs(readme): update installation instructions
test(mock): add edge case scenarios
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run all tests** and ensure they pass
4. **Update README.md** with details of changes if applicable
5. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/videos for UI changes
   - List of changes made

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No console.log or debugger statements
- [ ] Branch is up to date with main

## Project Structure

```
cypress/
├── e2e/              # Test files
│   ├── api/          # API tests
│   ├── ui/           # UI tests
│   └── accessibility/ # A11y tests
├── fixtures/         # Test data
├── pageObjects/      # Page Object Models
├── support/          # Custom commands & utilities
│   ├── commands/     # Custom Cypress commands
│   └── helpers/      # Utility functions
└── plugins/          # Cypress plugins
```

## Adding New Features

### Creating a New Test

1. Choose appropriate directory (`api/`, `ui/`, etc.)
2. Follow naming convention: `feature-name.cy.js`
3. Use Page Object Model for UI tests
4. Add descriptive comments
5. Include both positive and negative test cases

### Creating a Page Object

```javascript
class YourPage {
  constructor() {
    this.baseUrl = Cypress.env('yourUrl')
    this.selectors = {
      element: '[data-testid="element"]'
    }
  }

  visit() {
    cy.visit(this.baseUrl)
  }

  yourMethod() {
    // Implementation
  }
}

export default YourPage
```

### Adding Custom Commands

Add to `cypress/support/commands.js`:

```javascript
Cypress.Commands.add('yourCommand', (param) => {
  // Implementation
})
```

## Reporting Issues

### Bug Reports

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, browser, Node version)
- Error messages/stack traces

### Feature Requests

Include:

- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)
- Examples from other projects (optional)

## Testing Checklist

Before submitting:

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run prettier` - code formatted
- [ ] Manual testing completed
- [ ] No breaking changes (or documented)
- [ ] Tests added for new functionality

## Review Process

1. Maintainers will review within 3-5 business days
2. Address review comments promptly
3. Keep PR focused on single feature/fix
4. Be responsive to feedback
5. Update PR based on review feedback

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)

## Questions?

Feel free to:

- Open an issue for questions
- Join discussions in existing issues
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
