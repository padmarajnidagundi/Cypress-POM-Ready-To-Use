const { UserFactory, UserTypes } = require('../factories/userFactory')

// Error simulation delays
const ERROR_SIMULATION_DELAY = 1000

// Error response templates
const ErrorResponses = {
  UNAUTHORIZED: {
    status: 401,
    body: {
      error: 'Unauthorized',
      message: 'Invalid credentials or token'
    }
  },
  FORBIDDEN: {
    status: 403,
    body: {
      error: 'Forbidden',
      message: 'Insufficient permissions'
    }
  },
  VALIDATION: {
    status: 422,
    body: {
      error: 'Validation Error',
      details: []
    }
  },
  RATE_LIMIT: {
    status: 429,
    body: {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded'
    }
  },
  SERVER_ERROR: {
    status: 500,
    body: {
      error: 'Internal Server Error',
      message: 'Something went wrong'
    }
  }
}

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

Cypress.Commands.add('apiLoginWithInvalidCredentials', (username, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: { username, password },
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.eq(401)
    return response
  })
})

Cypress.Commands.add('createMalformedUser', (overrides = {}) => {
  const user = UserFactory.generate(overrides)
  // Corrupt the user data
  delete user.email // Missing required field
  user.username = '' // Empty required field
  user.password = '123' // Too short password
  return cy.wrap(user)
})

Cypress.Commands.add('simulateNetworkError', (method, path, errorType = 'SERVER_ERROR') => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${path}`, (req) => {
    req.reply({
      ...ErrorResponses[errorType],
      delay: ERROR_SIMULATION_DELAY
    })
  }).as(`${method.toLowerCase()}${path.replace(/\//g, '_')}Error`)
})

Cypress.Commands.add('createDuplicateUser', (existingUser) => {
  const duplicateUser = UserFactory.generate({
    email: existingUser.email, // Duplicate email to trigger conflict
    username: existingUser.username // Duplicate username to trigger conflict
  })
  return cy.wrap(duplicateUser)
})

Cypress.Commands.add('createInvalidUsers', (count, invalidationType = 'missing_fields') => {
  const invalidationStrategies = {
    missing_fields: (user) => {
      delete user.email
      delete user.password
      return user
    },
    invalid_format: (user) => ({
      ...user,
      email: 'invalid-email',
      password: '123'
    }),
    empty_values: (user) => ({
      ...user,
      username: '',
      firstName: '',
      lastName: ''
    })
  }

  const users = UserFactory.generateMany(count)
  const invalidUsers = users.map(invalidationStrategies[invalidationType])
  return cy.wrap(invalidUsers)
})

// Session token manipulation for auth testing
Cypress.Commands.add('useExpiredToken', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/auth/expired-token`,
    failOnStatusCode: false
  })
})

// Rate limit testing
Cypress.Commands.add('exhaustRateLimit', (endpoint, attempts = 10) => {
  const requests = Array(attempts).fill().map(() => 
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}${endpoint}`,
      failOnStatusCode: false
    })
  )
  return cy.wrap(Promise.all(requests))
})
