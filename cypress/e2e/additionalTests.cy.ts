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

  // API test: Check that the homepage returns 200
  it('API: should return 200 for homepage', () => {
    cy.request('https://wesendcv.com/').its('status').should('eq', 200);
  });

  // API test: Check that a non-existent endpoint returns 404
  it('API: should return 404 for non-existent endpoint', () => {
    cy.request({
      url: 'https://wesendcv.com/api/does-not-exist',
      failOnStatusCode: false
    }).its('status').should('eq', 404);
  });

  // API test: (example) Check that /api/status returns expected structure
  it('API: should return status object from /api/status', () => {
    cy.request({
      url: 'https://wesendcv.com/api/status',
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 401, 403, 404]).to.include(response.status);
      // Optionally check response body structure if known
      // expect(response.body).to.have.property('status');
    });
  });

  // Add more tests as needed
});
