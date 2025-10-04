import Login from '../pageObjects/reactLogin'

/**
 * Login Test Suite
 * Tests the authentication functionality of the React-Redux application
 * Tests include successful login scenarios and session management
 */
describe('UI Authentication Tests', function () {
    const login = new Login()

    beforeEach(() => {
        // Set up a session before each test to maintain login state
        cy.session('session_id', () => {
            cy.visit('https://react-redux.realworld.io/#/login')
            login.email().type('padmaraj.nidagundi@gmail.com')
            login.password().type('cypres100')
            login.signInButton().should('be.visible').click()
            cy.url().should('include', '/')
            cy.get('nav').should('contain', 'Your Feed')
        })
    })

    /**
     * Tests successful login with valid credentials
     * Verifies:
     * - Form interaction
     * - Successful navigation
     * - Dashboard elements visibility
     */
    it('should sign in successfully with valid credentials', function () {
        // Attempt login with valid credentials and verify dashboard
        cy.visit('https://react-redux.realworld.io/#/login')
        login.email().type('padmaraj.nidagundi@gmail.com')
        login.password().type('cypres100')
        login.signInButton().should('be.visible').click()
        cy.url().should('include', '/')
        cy.get('nav').should('contain', 'Your Feed')
    })

    /**
     * Tests login form validation
     * Verifies error messages for:
     * - Empty fields
     * - Invalid email format
     * - Minimum password length
     */
    it('should validate login form fields', function () {
        // Validate error messages for empty, invalid, and short password fields
        cy.visit('https://react-redux.realworld.io/#/login')
        
        // Test empty form submission
        login.signInButton().click()
        cy.get('.error-messages')
            .should('be.visible')
            .and('contain', 'email or password is invalid')

        // Test invalid email format
        login.email().type('invalid-email')
        login.password().type('password123')
        login.signInButton().click()
        cy.get('.error-messages')
            .should('be.visible')
            .and('contain', 'email or password is invalid')

        // Test minimum password length
        login.email().clear().type('valid@email.com')
        login.password().clear().type('123')
        login.signInButton().click()
        cy.get('.error-messages')
            .should('be.visible')
    })

    /**
     * Tests login error handling
     * Verifies system response to:
     * - Invalid credentials
     * - Network errors
     * - Server errors
     */
    it('should handle login errors appropriately', function () {
        // Test error handling for invalid credentials and server/network errors
        cy.visit('https://react-redux.realworld.io/#/login')
        
        // Test invalid credentials
        login.email().type('wrong@email.com')
        login.password().type('wrongpassword')
        login.signInButton().click()
        cy.get('.error-messages')
            .should('be.visible')
            .and('contain', 'email or password is invalid')

        // Test network error handling
        cy.intercept('POST', '**/api/users/login', {
            statusCode: 500,
            body: { 
                errors: { error: ['Server error'] }
            }
        }).as('loginError')
        
        login.email().clear().type('test@email.com')
        login.password().clear().type('password123')
        login.signInButton().click()
        
        cy.wait('@loginError')
        cy.get('.error-messages').should('be.visible')
    })

    /**
     * Tests login page UI elements
     * Verifies:
     * - Form field attributes
     * - Button states
     * - Navigation links
     */
    it('should verify login page UI elements', function () {
        // Verify UI elements and attributes on the login page
        cy.visit('https://react-redux.realworld.io/#/login')
        
        // Verify form fields
        login.email()
            .should('have.attr', 'type', 'email')
            .and('have.attr', 'placeholder', 'Email')
        
        login.password()
            .should('have.attr', 'type', 'password')
            .and('have.attr', 'placeholder', 'Password')
        
        // Verify button state
        login.signInButton()
            .should('be.visible')
            .and('be.enabled')
            .and('contain', 'Sign in')
        
        // Verify navigation links
        cy.contains('Need an account?')
            .should('be.visible')
            .and('have.attr', 'href', '#/register')
    })

    /**
     * Tests session persistence
     * Verifies:
     * - Login state persistence
     * - Token storage
     * - Session restoration
     */
    it('should maintain login session', function () {
        // Ensure login session persists after reload and token is stored
        cy.visit('https://react-redux.realworld.io/#/login')
        
        // Login and verify session storage
        login.email().type('padmaraj.nidagundi@gmail.com')
        login.password().type('cypres100')
        login.signInButton().click()
        
        // Verify local storage
        cy.window().its('localStorage')
            .invoke('getItem', 'jwt')
            .should('exist')
        
        // Refresh and verify session persistence
        cy.reload()
        cy.get('nav').should('contain', 'Your Feed')
    })

    /**
     * Additional edge case: Attempt login with empty email and password
     */
    it('should show error for empty email and password', function () {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.get('input[type="email"]').clear()
        cy.get('input[type="password"]').clear()
        cy.get('button').contains('Sign in').click()
        cy.get('.error-messages').should('be.visible')
    })

    /**
     * Additional edge case: Attempt login with whitespace-only credentials
     */
    it('should show error for whitespace-only credentials', function () {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.get('input[type="email"]').type('    ')
        cy.get('input[type="password"]').type('    ')
        cy.get('button').contains('Sign in').click()
        cy.get('.error-messages').should('be.visible')
    })

    /**
     * Additional edge case: Attempt login with XSS payload
     */
    it('should not be vulnerable to XSS in login fields', function () {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.get('input[type="email"]').type('<script>alert(1)</script>')
        cy.get('input[type="password"]').type('<script>alert(1)</script>')
        cy.get('button').contains('Sign in').click()
        cy.get('.error-messages').should('be.visible')
    })

    /**
     * Additional edge case: Attempt login with extremely long email/password
     */
    it('should handle extremely long email and password', function () {
        cy.visit('https://react-redux.realworld.io/#/login')
        const longStr = 'a'.repeat(1000)
        cy.get('input[type="email"]').type(longStr)
        cy.get('input[type="password"]').type(longStr)
        cy.get('button').contains('Sign in').click()
        cy.get('.error-messages').should('be.visible')
    })

    /**
     * Additional edge case: Attempt login with SQL injection string
     */
    it('should not be vulnerable to SQL injection in login fields', function () {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.get('input[type="email"]').type("' OR 1=1 --")
        cy.get('input[type="password"]').type("' OR 1=1 --")
        cy.get('button').contains('Sign in').click()
        cy.get('.error-messages').should('be.visible')
    })
})
