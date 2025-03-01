class homePageLinks {

   visit() {
      cy.visit('https://example.cypress.io/')
  }

  getHeader() {
      return cy.get('h1')
  }

  getNavigationLink(linkText) {
      return cy.get('a').contains(linkText)
  }
}

export default homePageLinks