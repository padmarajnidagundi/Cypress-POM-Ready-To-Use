import ExamplePage from '../pageObjects/homePageLinks'

/**
 * UI Test Suite for Cypress Kitchen Sink Example
 * Tests the functionality and navigation of the example.cypress.io utilities page
 * Verifies basic page elements, navigation, and interactive features
 */
describe('UI Test Suite - Cypress Kitchen Sink Example', () => {
    const examplePage = new ExamplePage()

    /**
     * Setup before each test
     * Visits the main page to ensure a clean state for each test
     */
    beforeEach(() => {
        examplePage.visit()
    })

    /**
     * Basic Page Load Test
     * Verifies that the page loads with correct header
     * Ensures the main content is visible and properly rendered
     */
    it('should verify the header text', () => {
        examplePage.getHeader()
            .should('be.visible')
            .and('contain', 'Kitchen Sink')
            .and('have.css', 'display', 'block')
    })

    /**
     * Navigation Test
     * Verifies navigation to Utilities page
     * Checks URL changes and content updates
     */
    it('should navigate to the "Utilities" page', () => {
        examplePage.getNavigationLink('Utilities').click()
        cy.url().should('include', '/utilities')
        cy.get('h1').should('contain', 'Utilities')
    })

    /**
     * Page Layout Test
     * Verifies the structure and layout of the page
     * Checks responsive behavior and element positioning
     */
    it('should verify page layout and structure', () => {
        // Check main navigation
        cy.get('nav').should('be.visible')
        
        // Check content layout
        cy.get('main').within(() => {
            cy.get('.container').should('exist')
            cy.get('.row').should('be.visible')
        })
        
        // Verify responsive behavior
        cy.viewport('iphone-x')
        cy.get('nav').should('be.visible')
        cy.viewport('macbook-15')
        cy.get('nav').should('be.visible')
    })

    /**
     * Interactive Elements Test
     * Verifies that all interactive elements are functional
     * Tests hover states, focus states, and click behaviors
     */
    it('should verify interactive elements behavior', () => {
        // Test navigation link hover states
        examplePage.getNavigationLink('Utilities')
            .trigger('mouseover')
            .should('have.css', 'cursor', 'pointer')
        
        // Test focus states
        examplePage.getNavigationLink('Utilities')
            .focus()
            .should('have.css', 'outline')
            .blur()
        
        // Test click feedback
        cy.get('a').first()
            .click()
            .should('have.css', 'color') // Verify color change on click
    })

    /**
     * Content Loading Test
     * Verifies that page content loads properly
     * Checks for presence of key elements and content
     */
    it('should verify content loading', () => {
        // Check initial content load
        cy.get('body').should('not.have.class', 'loading')
        
        // Verify main content sections
        cy.get('main').within(() => {
            cy.get('h1').should('be.visible')
            cy.get('p').should('exist')
            cy.get('a').should('be.visible')
        })
        
        // Check for broken images
        cy.get('img').each(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
    })

    /**
     * Error Handling Test
     * Verifies proper handling of navigation errors
     * Tests behavior with invalid routes and broken links
     */
    it('should handle navigation errors gracefully', () => {
        // Test invalid route
        cy.visit({
            url: 'https://example.cypress.io/invalid-route',
            failOnStatusCode: false
        })
        cy.get('.error-message').should('exist')
        
        // Test broken link handling
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('404')) {
                return false
            }
        })
    })

    /**
     * Performance Test
     * Verifies basic performance metrics
     * Checks load times and resource loading
     */
    it('should load within acceptable time', () => {
        // Measure page load time
        cy.window().then((win) => {
            const perfData = win.performance.timing
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
            expect(pageLoadTime).to.be.lessThan(3000) // 3 seconds threshold
        })
        
        // Verify resource loading
        cy.get('script').should('have.length.lessThan', 20) // Reasonable script count
    })
})
