describe('Additional Tests', () => {
  it('should visit the homepage', () => {
    cy.visit('https://wesendcv.com/');
    cy.url().should('eq', 'https://wesendcv.com/');
    cy.title().should('include', 'WeSendCV');
    cy.contains('Home').should('exist').and('be.visible');
    cy.get('header').should('exist');
  });

  it('should check for a login button', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('button').contains('Login').should('be.visible').and('not.be.disabled');
    cy.get('nav').should('exist');
  });

  // Add more tests as needed
});
