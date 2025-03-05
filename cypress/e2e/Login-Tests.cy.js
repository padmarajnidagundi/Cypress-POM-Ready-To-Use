import Login from '../pageObjects/reactLogin'

describe('UI test for login to app', function () {
    const login = new Login()

    beforeEach(() => {
        cy.session('session_id', () => {
            cy.visit('https://react-redux.realworld.io/#/login')
            login.email().type('padmaraj.nidagundi@gmail.com')
            login.password().type('cypres100')
            login.signInButton().should('be.visible').click()
            cy.url().should('include', '/')
            cy.get('nav').should('contain', 'Your Feed')
        })
    })

    it('Sign in', function () {
        cy.visit('https://react-redux.realworld.io/#/login')
        login.email().type('padmaraj.nidagundi@gmail.com')
        login.password().type('cypres100')
        login.signInButton().should('be.visible').click()
        cy.url().should('include', '/')
        cy.get('nav').should('contain', 'Your Feed')
    })
})
<<<<<<< What above tests do <<<<<<<
/**//+
 * Describes a suite of UI tests for the login functionality of the application.//+
 * This test suite includes a setup for each test and a specific test for signing in.//+
 * //+
 * @param {string} description - The description of the test suite.//+
 * @param {Function} testFunction - The function containing the test suite implementation.//+
 * @returns {void}//+
 *///+
describe('UI test for login to app', function () {//+
    const login = new Login()//+
//+
    beforeEach(() => {//+
        cy.session('session_id', () => {//+
            cy.visit('https://react-redux.realworld.io/#/login')//+
            login.email().type('padmaraj.nidagundi@gmail.com')//+
            login.password().type('cypres100')//+
            login.signInButton().should('be.visible').click()//+
            cy.url().should('include', '/')//+
            cy.get('nav').should('contain', 'Your Feed')//+
        })//+
    })//+
//+
    it('Sign in', function () {//+
        cy.visit('https://react-redux.realworld.io/#/login')//+
        login.email().type('padmaraj.nidagundi@gmail.com')//+
        login.password().type('cypres100')//+
        login.signInButton().should('be.visible').click()//+
        cy.url().should('include', '/')//+
        cy.get('nav').should('contain', 'Your Feed')//+
    })//+
})//+
