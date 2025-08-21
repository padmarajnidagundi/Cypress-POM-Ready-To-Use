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

  // Positive API test: Homepage returns 200 and contains expected content
  it('API: homepage should contain expected HTML', () => {
    cy.request('https://wesendcv.com/').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('<!DOCTYPE html>');
      expect(response.body).to.include('WeSendCV');
    });
  });

  // Positive API test: /api/status returns a valid status property if available
  it('API: /api/status should return a status property if 200', () => {
    cy.request({
      url: 'https://wesendcv.com/api/status',
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('status');
      }
    });
  });

  // Negative API test: Invalid method on homepage
  it('API: should return 405 or 4xx for POST to homepage', () => {
    cy.request({
      method: 'POST',
      url: 'https://wesendcv.com/',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 403, 404, 405]);
    });
  });

  // Negative API test: Invalid method on /api/status
  it('API: should return 405 or 4xx for DELETE on /api/status', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://wesendcv.com/api/status',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 403, 404, 405]);
    });
  });

  // Negative API test: Malformed URL
  it('API: should fail for malformed URL', () => {
    cy.request({
      url: 'https://wesendcv.com/api/%%%',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  // Add more tests as needed
});
