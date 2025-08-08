import HomePageLinks from '../pageObjects/queryingPageLinks'

/**
 * UI Test Suite for Cypress Querying Examples
 * Tests the functionality of the Cypress querying examples page
 * Verifies selectors, DOM traversal, and element interactions
 */
describe('UI Test Suite - Cypress Querying Examples', () => {
    const homePage = new HomePageLinks()

    /**
     * Setup before each test
     * Visits the querying examples page to ensure a clean state
     */
    beforeEach(() => {
        homePage.visit()
    })

    /**
     * Header Verification Test
     * Verifies the main header content and styling
     */
    it('should verify the header text', () => {
        // Check that the header is visible, contains correct text, and has styling
        homePage.getHeader()
            .should('be.visible')
            .and('contain', 'Querying')
            .and('have.css', 'font-size')
            .and('not.be.empty')
    })

    /**
     * Querying Section Test
     * Verifies the presence and visibility of the main querying section
     */
    it('should verify the presence of the querying section', () => {
        // Check that the querying section and its children are visible
        homePage.getQueryingSection()
            .should('be.visible')
            .and('exist')
            .within(() => {
                cy.get('.query-list')
                    .should('exist')
                cy.get('.query-button')
                    .should('be.visible')
            })
    })

    /**
     * Query Examples Button Test
     * Verifies all example buttons are present and interactive
     */
    it('should verify the querying examples buttons', () => {
        // Check that each querying example button is visible and has correct class
        homePage.getQueryingExamples().each((button) => {
            cy.wrap(button)
                .should('be.visible')
                .and('have.attr', 'class')
                .and('include', 'query-btn')
        })
    })

    /**
     * DOM Traversal Test
     * Tests various DOM traversal methods and selectors
     */
    it('should demonstrate DOM traversal methods', () => {
        // Test parent, children, and siblings traversal for querying elements
        cy.get('.query-button')
            .parent()
            .should('have.class', 'query-container')

        cy.get('.query-list')
            .children()
            .should('have.length.gt', 0)

        cy.get('.query-button')
            .siblings()
            .should('exist')
    })

    /**
     * Element State Tests
     * Verifies different element states and properties
     */
    it('should verify element states and properties', () => {
        // Check visibility, attributes, and classes of querying elements
        homePage.getQueryingExamples().first()
            .should('be.visible')
            .and('not.be.disabled')

        cy.get('.query-button')
            .should('have.attr', 'type')
            .and('not.be.empty')

        cy.get('.query-btn')
            .should('have.class', 'query-btn')
            .and('not.have.class', 'disabled')
    })

    /**
     * Form Elements Test
     * Tests querying and interacting with form elements
     */
    it('should interact with form elements', () => {
        // Interact with input field and submit form, verify submission state
        cy.get('.query-form')
            .find('input')
            .type('test query')
            .should('have.value', 'test query')

        cy.get('.query-form')
            .submit()
            .should('have.class', 'submitted')
    })

    /**
     * Dynamic Content Test
     * Verifies querying of dynamically loaded content
     */
    it('should handle dynamic content', () => {
        // Click button to load dynamic content and verify its presence and update
        cy.get('.query-button').first().click()

        cy.get('.dynamic-content')
            .should('exist')
            .and('be.visible')
            .and('not.be.empty')

        cy.get('.dynamic-content')
            .invoke('text')
            .should('not.be.empty')
    })

    /**
     * Error State Test
     * Verifies error handling and display
     */
    it('should verify error states', () => {
        // Trigger error state and verify error message and styling
        cy.get('.query-button[data-error]').click()

        cy.get('.error-message')
            .should('be.visible')
            .and('contain', 'Error')

        cy.get('.error-state')
            .should('have.class', 'error')
    })

    /**
     * Accessibility Testing
     * Verifies basic accessibility attributes
     */
    it('should verify accessibility attributes', () => {
        // Check ARIA labels, tab navigation, and focus management for accessibility
        cy.get('.query-button')
            .should('have.attr', 'aria-label')

        cy.get('.query-form')
            .find('input')
            .should('have.attr', 'tabindex')
            .and('not.eq', '-1')

        cy.get('.query-button').first()
            .focus()
            .should('have.focus')
    })

    /**
     * Test suite for verifying the Querying page functionality on example.cypress.io
     * Focuses on basic UI elements and content verification
     */
    describe('UI Test 2 Querying example.cypress.io Page Tests', () => {
        /**
         * Before each test, visit the querying page
         */
        beforeEach(() => {
            homePage.visit()
        })

        /**
         * Verifies that the main header contains the text "Querying"
         * This ensures we're on the correct page
         */
        it('should verify the header text', () => {
            // Check that the header contains "Querying"
            homePage.getHeader().should('contain', 'Querying')
        })

        /**
         * Checks if the querying section is visible to users
         * This is a basic visibility test for the main content area
         */
        it('should verify the presence of the querying section', () => {
            // Check that the querying section is visible
            homePage.getQueryingSection().should('be.visible')
        })

        /**
         * Verifies that all querying example buttons are visible
         * Iterates through each button to ensure they are properly displayed
         */
        it('should verify the querying examples buttons', () => {
            // Check that each querying example button is visible
            //homePage.getQueryingExamples().should('have.length', 5)
            homePage.getQueryingExamples().each((button) => {
                cy.wrap(button).should('be.visible')
            })
        })
    })
})