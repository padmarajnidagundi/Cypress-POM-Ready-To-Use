class BasePage {
  constructor() {
    this.baseUrl = Cypress.env('exampleUrl')
  }

  visit(path = '') {
    cy.visit(`${this.baseUrl}${path}`)
  }

  getElement(selector) {
    return cy.get(selector)
  }

  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`)
  }

  containsText(text) {
    return cy.contains(text)
  }
}

export default BasePage
