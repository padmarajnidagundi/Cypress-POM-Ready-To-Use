import HomePageLinks from '../pageObjects/queryingPageLinks'

describe('UI Test 2 Querying example.cypress.io Page Tests', () => {
    const homePage = new HomePageLinks()

    beforeEach(() => {
        homePage.visit()
    })

    it('should verify the header text', () => {
        homePage.getHeader().should('contain', 'Querying')
    })

    it('should verify the presence of the querying section', () => {
        homePage.getQueryingSection().should('be.visible')
    })

    it('should verify the querying examples buttons', () => {
        //homePage.getQueryingExamples().should('have.length', 5)
        homePage.getQueryingExamples().each((button) => {
            cy.wrap(button).should('be.visible')
        })
    })
})