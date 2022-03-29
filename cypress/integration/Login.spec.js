import Login from '../pageObjects/login'

describe('Login', function(){
    const login = new Login()
    Cypress.Cookies.preserveOnce('session_id', 'remember_token')
    
    it('Sign in', function(){
        cy.visit('https://react-redux.realworld.io/#/login')
        login.email().type('padmaraj.nidagundi@gmail.com')
        login.password().type('cypres100')
        login.signInButton().should('be.visible').click()
    })
})