import ExamplePage from '../pageObjects/homePageLinks'


<<<<<<< What this test do <<<<<<<
/**//+
 * Test suite for UI Test 1 on the example.cypress.io Utilities page.//+
 * This suite verifies the header text and navigation to the Utilities page.//+
 * //+
 * @param {string} description - The description of the test suite.//+
 * @param {Function} callback - The function containing the test cases.//+
 *///+
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
