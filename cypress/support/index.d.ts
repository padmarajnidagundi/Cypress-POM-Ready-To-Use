declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login to the application
     * @example cy.login('user@email.com', 'password')
     */
    login(email: string, password: string): Chainable<Element>
  }
}
