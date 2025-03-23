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
