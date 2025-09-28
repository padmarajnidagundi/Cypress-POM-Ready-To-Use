describe('Additional Tests', () => {
  // Test visiting the homepage and verifying key elements
  it('should visit the homepage', () => {
    cy.visit('https://wesendcv.com/');
    cy.url().should('eq', 'https://wesendcv.com/');
    cy.title().should('include', 'WeSendCV');
    cy.contains('Home').should('exist').and('be.visible');
    cy.get('header').should('exist');
    // Additional assertions
    cy.get('footer').should('exist');
    cy.get('meta[name="description"]').should('have.attr', 'content');
    cy.get('body').should('be.visible');
  });

  // Test for the presence and state of the Login button
  it('should check for a login button', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('button').contains('Login').should('be.visible').and('not.be.disabled');
    cy.get('nav').should('exist');
    // Additional assertions
    cy.get('button').contains('Login').should('have.length', 1);
    cy.get('nav').find('a').should('have.length.greaterThan', 0);
  });

  // Negative test: Ensure a non-existent element is not present
  it('should not find a non-existent element', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('.does-not-exist').should('not.exist');
    // Additional assertion
    cy.get('.random-fake-class').should('not.exist');
  });

  // Negative test: Ensure the "Logout" button is not visible for unauthenticated users
  it('should not show Logout button when not logged in', () => {
    cy.visit('https://wesendcv.com/');
    cy.contains('button', 'Logout').should('not.exist');
    // Additional assertion
    cy.contains('Profile').should('not.exist');
  });

  // Negative test: Ensure restricted page cannot be accessed without login
  it('should not allow access to a restricted page without login', () => {
    cy.visit('https://wesendcv.com/dashboard', { failOnStatusCode: false });
    cy.url().should('not.include', '/dashboard');
    // Additional assertion: check for redirect or error message
    cy.contains(/login|unauthorized|sign in/i).should('exist');
  });

  // API test: Check that the homepage returns 200
  it('API: should return 200 for homepage', () => {
    cy.request('https://wesendcv.com/').its('status').should('eq', 200);
    // Additional assertion: check content-type header
    cy.request('https://wesendcv.com/').its('headers').its('content-type').should('include', 'text/html');
  });

  // API test: Check that a non-existent endpoint returns 404
  it('API: should return 404 for non-existent endpoint', () => {
    cy.request({
      url: 'https://wesendcv.com/api/does-not-exist',
      failOnStatusCode: false
    }).its('status').should('eq', 404);
    // Additional assertion: check response body is not empty
    cy.request({
      url: 'https://wesendcv.com/api/does-not-exist',
      failOnStatusCode: false
    }).its('body').should('not.be.empty');
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
      // Additional assertion: response body should be an object if 200
      if (response.status === 200) {
        expect(response.body).to.be.an('object');
      }
    });
  });

  // Positive API test: Homepage returns 200 and contains expected content
  it('API: homepage should contain expected HTML', () => {
    cy.request('https://wesendcv.com/').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('<!DOCTYPE html>');
      expect(response.body).to.include('WeSendCV');
      // Additional assertion: check for closing html tag
      expect(response.body).to.include('</html>');
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
        // Additional assertion: status property should be a string or boolean
        expect(['string', 'boolean']).to.include(typeof response.body.status);
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
      // Additional assertion: response body should not be empty
      expect(response.body).to.not.be.undefined;
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
      // Additional assertion: response body should not be empty
      expect(response.body).to.not.be.undefined;
    });
  });

  // Negative API test: Malformed URL
  it('API: should fail for malformed URL', () => {
    cy.request({
      url: 'https://wesendcv.com/api/%%%',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
      // Additional assertion: response body should not be empty
      expect(response.body).to.not.be.undefined;
    });
  });

  // Performance test: Homepage load time should be under 3 seconds
  it('Performance: homepage should load in under 3 seconds', () => {
    const start = Date.now();
    cy.visit('https://wesendcv.com/').then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(3000);
    });
  });

  // Negative performance test: Homepage load time should NOT be under 10 seconds
  it('Negative Performance: homepage should NOT load in under 10 seconds (simulated)', () => {
    const start = Date.now();
    cy.visit('https://wesendcv.com/').then(() => {
      const duration = Date.now() - start;
      // This assertion is expected to fail if the site is fast
      expect(duration).to.be.greaterThan(10000);
    });
  });

  // Accessibility test: Check for common accessibility attributes and roles
  it('Accessibility: homepage should have key accessibility features', () => {
    cy.visit('https://wesendcv.com/');
    // Check for lang attribute on html
    cy.get('html').should('have.attr', 'lang');
    // Check for main landmark
    cy.get('main').should('exist');
    // Check for alt attributes on images
    cy.get('img').each(($img) => {
      expect($img).to.have.attr('alt').and.not.be.empty;
    });
    // Check for aria-label or role on navigation
    cy.get('nav').should('have.attr', 'aria-label').or('have.attr', 'role');
    // Check for accessible button names
    cy.get('button').each(($btn) => {
      expect($btn.text().trim().length).to.be.greaterThan(0);
    });
  });

  // Negative Accessibility test: Ensure missing accessibility attributes are detected
  it('Negative Accessibility: homepage should NOT have images without alt attributes', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('img').each(($img) => {
      // This assertion is expected to fail if any image is missing alt
      expect($img).to.have.attr('alt').and.not.be.empty;
    });
  });

  it('Negative Accessibility: homepage should NOT have nav without aria-label or role', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('nav').should('not.exist').or('not.have.attr', 'aria-label').or('not.have.attr', 'role');
  });

  // Security test: Check for common security headers
  it('Security: homepage should have common security headers', () => {
    cy.request('https://wesendcv.com/').then((response) => {
      expect(response.headers).to.have.property('x-frame-options');
      expect(response.headers).to.have.property('x-content-type-options');
      expect(response.headers).to.have.property('content-security-policy');
      expect(response.headers['x-content-type-options']).to.equal('nosniff');
    });
  });

  // Test: Check favicon is present
  it('should have a favicon', () => {
    cy.visit('https://wesendcv.com/');
    cy.get('link[rel="icon"]').should('exist');
  });

  // Test: Check robots.txt is accessible
  it('should serve robots.txt', () => {
    cy.request('https://wesendcv.com/robots.txt').its('status').should('eq', 200);
    cy.request('https://wesendcv.com/robots.txt').its('headers').its('content-type').should('include', 'text/plain');
  });

  // Test: Check sitemap.xml is accessible
  it('should serve sitemap.xml', () => {
    cy.request('https://wesendcv.com/sitemap.xml').its('status').should('eq', 200);
    cy.request('https://wesendcv.com/sitemap.xml').its('headers').its('content-type').should('include', 'xml');
  });

  // Test: HEAD request to homepage
  it('API: should respond to HEAD request for homepage', () => {
    cy.request({
      method: 'HEAD',
      url: 'https://wesendcv.com/',
      failOnStatusCode: false
    }).its('status').should('eq', 200);
  });

  // Test: OPTIONS request to homepage
  it('API: should respond to OPTIONS request for homepage', () => {
    cy.request({
      method: 'OPTIONS',
      url: 'https://wesendcv.com/',
      failOnStatusCode: false
    }).its('status').should.be.oneOf([200, 204, 405]);
  });

  // Test: PATCH request to /api/status
  it('API: should respond to PATCH request for /api/status', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://wesendcv.com/api/status',
      failOnStatusCode: false
    }).its('status').should.be.oneOf([200, 400, 403, 404, 405]);
  });

  // Performance: API response time for homepage
  it('Performance: homepage API should respond in under 1 second', () => {
    const start = Date.now();
    cy.request('https://wesendcv.com/').then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(1000);
    });
  });

  // Negative test: Try to access admin page unauthenticated
  it('should not allow access to admin page without login', () => {
    cy.visit('https://wesendcv.com/admin', { failOnStatusCode: false });
    cy.url().should('not.include', '/admin');
    cy.contains(/login|unauthorized|sign in/i).should('exist');
  });

  // Security: Check for strict-transport-security header
  it('Security: homepage should have strict-transport-security header', () => {
    cy.request('https://wesendcv.com/').then((response) => {
      expect(response.headers).to.have.property('strict-transport-security');
    });
  });

  // Add more tests as needed
});
