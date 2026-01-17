export interface Selectors {
  [key: string]: string
}

export interface PageObject {
  visit(path?: string): void
  getElement(selector: string): Cypress.Chainable
  getByTestId(testId: string): Cypress.Chainable
  containsText(text: string): Cypress.Chainable
}
