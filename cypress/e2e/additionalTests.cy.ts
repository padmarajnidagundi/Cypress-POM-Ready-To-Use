describe('Additional Tests', () => {
  it('should visit the homepage', () => {
    cy.visit('https://wesendcv.com/');
    cy.contains('Home').should('exist');
  });

  it('should check for a login button', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('button').contains('Login').should('be.visible');
  });

  // Add more tests as needed
});
