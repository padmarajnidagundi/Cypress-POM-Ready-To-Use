describe('Additional Tests', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.contains('Home').should('exist');
  });

  it('should check for a login button', () => {
    cy.visit('/');
    cy.get('button').contains('Login').should('be.visible');
  });

  // Add more tests as needed
});
