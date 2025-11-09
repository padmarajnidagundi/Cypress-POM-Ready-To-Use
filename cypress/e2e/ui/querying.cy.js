import HomePageLinks from '../../pageObjects/pages/queryingPageLinks'
// ...existing code from UI-Test2.cy.js...

describe('Advanced DOM Querying Tests', () => {
  const homePage = new HomePageLinks()

  beforeEach(() => {
    homePage.visit()
  })

  it('should traverse DOM hierarchy correctly', () => {
    cy.get('.query-list')
      .children()
      .should('have.length.gt', 0)
      .first()
      .parent()
      .should('have.class', 'query-list')
  })

  it('should verify element states', () => {
    cy.get('button.query-btn')
      .should('be.visible')
      .and('be.enabled')
      .invoke('attr', 'type')
      .should('eq', 'button')
  })

  it('should handle dynamic content loading', () => {
    cy.get('.query-button').first().click()
    cy.get('.dynamic-content')
      .should('exist')
      .and('be.visible')
      .and('not.be.empty')
  })
})
