// Simple chaos-style smoke test
// Simulates random delays and basic assertions to exercise resilience.

describe('Chaos Example', () => {
  const baseUrl = 'https://example.cypress.io'

  const randomDelay = () => {
    const delay = Math.floor(Math.random() * 500) + 200 // 200-700ms jitter
    cy.wait(delay)
  }

  it('handles jittery navigation and content', () => {
    cy.visit(baseUrl)

    randomDelay()
    cy.contains('type').click()

    randomDelay()
    cy.url().should('include', '/commands/actions')

    randomDelay()
    cy.get('.action-email').type('testing@example.com')

    randomDelay()
    cy.contains('Submit').click()

    randomDelay()
    cy.get('#email-help').should('be.visible')
  })
})
