Cypress.Commands.add('mockNetworkResponse', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response,
    delayMs: 100
  }).as(`${method.toLowerCase()}${url.replace(/\//g, '_')}`)
})

Cypress.Commands.add('mockGraphQL', (operationName, response) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === operationName) {
      req.reply(response)
    }
  }).as(`gql${operationName}`)
})
