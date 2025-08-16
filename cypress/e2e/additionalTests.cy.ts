describe('Additional Tests', () => {
  // Test visiting the homepage and verifying key elements
  it('should visit the homepage', () => {
    cy.visit('https://wesendcv.com/');
    cy.url().should('eq', 'https://wesendcv.com/');
    cy.title().should('include', 'WeSendCV');
    cy.contains('Home').should('exist').and('be.visible');
    cy.get('header').should('exist');
  });

  // Test for the presence and state of the Login button
  it('should check for a login button', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('button').contains('Login').should('be.visible').and('not.be.disabled');
    cy.get('nav').should('exist');
  });

  // Negative test: Ensure a non-existent element is not present
  it('should not find a non-existent element', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('.does-not-exist').should('not.exist');
  });

  // Negative test: Ensure the "Logout" button is not visible for unauthenticated users
  it('should not show Logout button when not logged in', () => {
    cy.visit('https://wesendcv.com/');
    cy.contains('button', 'Logout').should('not.exist');
  });

  // Negative test: Ensure restricted page cannot be accessed without login
  it('should not allow access to a restricted page without login', () => {
    cy.visit('https://wesendcv.com/dashboard', { failOnStatusCode: false });
    cy.url().should('not.include', '/dashboard');
  });

  // Add more tests as needed
});
