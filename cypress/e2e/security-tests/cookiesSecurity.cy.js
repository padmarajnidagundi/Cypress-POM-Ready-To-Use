describe('Cookie security attributes', () => {
  before(() => {
    const url = Cypress.env('exampleUrl') || 'https://example.cypress.io'
    cy.visit(url)
  })

  it('sets cookies with Secure, HttpOnly, and SameSite=Strict', () => {
    cy.setCookie('session_id', 'testvalue', {
      secure: true,
      httpOnly: true,
      sameSite: 'Strict',
      path: '/'
    })

    cy.getCookie('session_id').should((cookie) => {
      expect(cookie).to.exist
      expect(cookie.secure).to.be.true
      expect(cookie.httpOnly).to.be.true
      expect(String(cookie.sameSite).toLowerCase()).to.eq('strict')
    })
  })
})
