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
    cy.get('.dynamic-content').should('exist').and('be.visible').and('not.be.empty')
  })

  it('should safely handle missing optional elements', () => {
    cy.get('body').then(($body) => {
      expect($body.find('.does-not-exist').length).to.eq(0)
    })
  })

  it('should keep querying buttons stable after rapid clicks', () => {
    cy.get('.query-btn').first().as('firstQueryButton')

    cy.get('@firstQueryButton').click().click().click()
    cy.get('@firstQueryButton').should('be.visible').and('be.enabled')
  })

  it('should keep DOM traversal scoped to querying section', () => {
    homePage
      .getQueryingSection()
      .find('.query-btn')
      .should('have.length.gt', 0)
      .each(($button) => {
        cy.wrap($button).should('be.visible')
      })
  })
})
