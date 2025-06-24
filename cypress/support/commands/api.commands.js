const { UserFactory, UserTypes } = require('../factories/userFactory')

Cypress.Commands.add('apiLogin', (username, password) => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
            username,
            password
        }
    })
})

Cypress.Commands.add('apiRequest', (method, path, options = {}) => {
  const defaults = {
    method,
    url: `${Cypress.env('apiUrl')}${path}`,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
    }
  }

  return cy.request({
    ...defaults,
    ...options,
  })
})

Cypress.Commands.add('createTestUser', (overrides = {}, userType = UserTypes.REGULAR) => {
  const user = UserFactory.generate(overrides, userType)
  return cy.wrap(user)
})

Cypress.Commands.add('createTestUsers', (count, overrides = {}, userType = UserTypes.REGULAR) => {
  const users = UserFactory.generateMany(count, overrides, userType)
  return cy.wrap(users)
})
