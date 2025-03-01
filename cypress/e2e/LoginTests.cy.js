import Login from '../pageObjects/reactLogin'

describe('Login', function () {
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