import BasePage from './basePage'

class Login extends BasePage {
  constructor() {
    super()
    this.selectors = {
      emailInput: 'input[type="email"]',
      passwordInput: 'input[type="password"]',
      signInButton: '.btn:contains("Sign in")',
      feedNav: 'nav:contains("Your Feed")'
    }
  }

  login(email, password) {
    this.getElement(this.selectors.emailInput).type(email)
    this.getElement(this.selectors.passwordInput).type(password)
    this.getElement(this.selectors.signInButton).click()
  }

  verifySuccessfulLogin() {
    cy.url().should('include', '/')
    this.getElement(this.selectors.feedNav).should('be.visible')
  }
}

export default Login
