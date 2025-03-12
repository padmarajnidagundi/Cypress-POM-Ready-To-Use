import ExamplePage from '../pageObjects/homePageLinks'

describe('UI Test 1  Utilities example.cypress.io Page Tests', () => {
    const examplePage = new ExamplePage()

    beforeEach(() => {
        examplePage.visit()
    })

    it('should verify the header text', () => {
        examplePage.getHeader().should('contain', 'Kitchen Sink')
    })

    it('should navigate to the "Utilities" page', () => {
        examplePage.getNavigationLink('Utilities').click()
        cy.url().should('include', '/utilities')
        cy.get('h1').should('contain', 'Utilities')
    })
})
