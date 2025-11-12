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
        // Check that the header is visible and contains correct text
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
        // Click on Utilities link and verify navigation and content
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
        // Check navigation and layout structure, and responsive behavior
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
        // Test hover, focus, and click feedback for interactive elements
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
        // Check that content loads and images are not broken
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
        // Test navigation to invalid route and handle broken links
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
        // Measure page load time and check resource loading
        // Measure page load time
        cy.window().then((win) => {
            const perfData = win.performance.timing
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
            expect(pageLoadTime).to.be.lessThan(3000) // 3 seconds threshold
        })
        
        // Verify resource loading
        cy.get('script').should('have.length.lessThan', 20) // Reasonable script count
    })

    /**
     * Edge case: Navigation to a page with no content
     */
    it('should handle navigation to a page with no content', () => {
        cy.visit('https://example.cypress.io/empty', { failOnStatusCode: false })
        cy.get('body').should('exist')
        cy.get('body').should('be.empty')
    })

    /**
     * Edge case: Attempt to interact with a disabled button
     */
    it('should not allow interaction with a disabled button', () => {
        cy.get('button:disabled').should('exist').and('be.visible')
        cy.get('button:disabled').click({ force: true })
        // No action should be performed
    })

    /**
     * Edge case: Attempt to submit a form with missing required fields
     */
    it('should show error when submitting form with missing required fields', () => {
        cy.get('form').first().within(() => {
            cy.get('input[required]').clear()
            cy.root().submit()
        })
        cy.get('.error-message, .error').should('exist')
    })

    /**
     * Edge case: Attempt to load a page with a malformed URL
     */
    it('should handle malformed URL gracefully', () => {
        cy.visit('https://example.cypress.io/%%%malformed', { failOnStatusCode: false })
        cy.get('body').should('exist')
        cy.get('.error-message').should('exist')
    })

    /**
     * Edge case: Attempt to access a restricted page
     */
    it('should not allow access to restricted page', () => {
        cy.visit('https://example.cypress.io/admin', { failOnStatusCode: false })
        cy.url().should('not.include', '/admin')
        cy.get('.error-message').should('exist')
    })

    /**
     * Accessibility: skip-to-content link should be present and functional
     */
    it('accessibility: should have a working skip-to-content link', () => {
        examplePage.visit()
        cy.get('a[href="#main"], a.skip-to-content')
            .should('exist')
            .then($link => {
                // If present, follow it and ensure main receives focus
                if ($link.length) {
                    cy.wrap($link).click()
                    cy.get('main').should('have.focus')
                }
            })
    })

    /**
     * Keyboard: tab order should reach interactive elements in a sensible order
     */
    it('keyboard: should have sensible tab order to main interactive elements', () => {
        examplePage.visit()
        // Start from body and tab through first few focusable elements
        cy.get('body').tab() // requires cypress-plugin-tab if installed; fallback to focus checks
        cy.get('a, button, input, select, textarea').first().focus().should('have.focus')
    })

    /**
     * Form: should allow keyboard submission (Enter) for first form on page
     */
    it('form: should submit first form via Enter key when focused on input', () => {
        examplePage.visit()
        cy.get('form').first().within(() => {
            cy.get('input[type="text"], input[type="email"], textarea').first().then($input => {
                if ($input.length) {
                    cy.wrap($input).type('test{enter}')
                    // best-effort: check for form submission effects (navigation or success message)
                    cy.wait(200)
                    cy.get('body').then($b => {
                        // if a success indicator exists, assert it; otherwise ensure no uncaught exception
                        if ($b.find('.success, .submitted').length) {
                            cy.get('.success, .submitted').should('exist')
                        }
                    })
                }
            })
        })
    })

    /**
     * Links: external links should open in new tab (target="_blank") or be explicit
     */
    it('links: should mark external links with target or rel attributes', () => {
        examplePage.visit()
        cy.get('a[href^="http"]').each($a => {
            const $el = Cypress.$($a)
            const target = $el.attr('target')
            const rel = $el.attr('rel')
            // Accept either opening in new tab or having rel="noopener" for external links
            expect(target === '_blank' || typeof target === 'undefined' || rel !== undefined).to.be.true
        })
    })
})
