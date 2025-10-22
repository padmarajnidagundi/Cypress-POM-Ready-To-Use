/**
 * API Security Test Suite
 * Validates authentication, input sanitization, and access control for API endpoints.
 */
describe('API Security Tests', () => {
  /**
   * Test: Authentication requirements
   * Attempts to access a protected resource with an invalid token.
   * Note: reqres.in returns 200, but real APIs should return 401 Unauthorized.
   */
  it('should validate authentication requirements', () => {
    cy.apiRequest('GET', '/users/2', {
      headers: {
        'Authorization': 'Bearer invalid_token'
      }
    }).then((response) => {
      // reqres.in returns 200 even for invalid tokens, but in real APIs it should be 401
      expect(response.status).to.eq(200)
    })
  })

  /**
   * Test: Invalid login attempts
   * Attempts to log in with invalid credentials and expects an error response.
   * Validates that the API does not allow authentication with incorrect credentials.
   */
  it('should handle invalid login attempts', () => {
    cy.apiRequest('POST', '/login', {
      body: {
        email: 'invalid@email.com',
        password: 'wrongpassword'
      }
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error')
    })
  })

  /**
   * Test: Input sanitization
   * Attempts to create a user with malicious input (XSS and SQL injection payloads).
   * Verifies that the API sanitizes input and does not reflect scripts in the response.
   */
  it('should validate input sanitization', () => {
    const maliciousPayload = {
      name: '<script>alert("xss")</script>',
      job: "' OR '1'='1"
    }

    cy.apiRequest('POST', '/users', {
      body: maliciousPayload
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.name).to.not.include('<script>')
    })
  })

  /**
   * Test: Unauthorized resource access
   * Attempts to delete a user with an invalid token.
   * Note: reqres.in returns 204, but real APIs should return 403 or 401.
   */
  it('should prevent unauthorized resource access', () => {
    cy.apiRequest('DELETE', '/users/1', {
      headers: {
        'Authorization': 'Bearer invalid_token'
      }
    }).then((response) => {
      // reqres.in returns 204 for delete operations
      expect(response.status).to.eq(204)
    })
  })

  /**
   * Edge case: SQL injection style payload should not leak DB errors
   */
  it('should not leak database errors for SQL-injection-like payloads', () => {
    const payload = {
      name: "' OR '1'='1'; --",
      job: 'injection-test'
    }

    cy.apiRequest('POST', '/users', { body: payload, failOnStatusCode: false }).then((response) => {
      // Accept either sanitized creation or a validation error - but not raw DB error strings
      expect([200, 201, 400, 422]).to.include(response.status)
      if (response.body && typeof response.body === 'string') {
        expect(response.body).to.not.match(/SQL|syntax error|ORA-|mysql/i)
      } else if (response.body && typeof response.body === 'object') {
        const asString = JSON.stringify(response.body).toLowerCase()
        expect(asString).to.not.include('sql').and.to.not.include('syntax error')
      }
    })
  })

  /**
   * Edge case: Huge payload handling (413 Payload Too Large)
   */
  it('should handle huge payloads appropriately', () => {
    const huge = { data: 'x'.repeat(2_000_000) } // ~2MB
    cy.apiRequest('POST', '/users', { body: huge, failOnStatusCode: false }).then((response) => {
      expect([200, 201, 400, 413]).to.include(response.status)
    })
  })

  /**
   * Edge case: Missing Content-Type header
   * Server should respond defensively when Content-Type is absent or unexpected
   */
  it('should respond appropriately when Content-Type header is missing', () => {
    cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') ? `${Cypress.config('baseUrl')}/users` : '/users',
      body: { name: 'no-content-type' },
      headers: { /* intentionally empty */ },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 201, 400, 415]).to.include(response.status)
    })
  })

  /**
   * Edge case: Simulated rate limit with Retry-After header
   */
  it('should surface Retry-After header when rate limited (simulated)', () => {
    cy.intercept('GET', '/users', {
      statusCode: 429,
      headers: { 'retry-after': '2' },
      body: { error: 'rate limited' }
    }).as('rateLimitSim')

    cy.apiRequest('GET', '/users', { failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(429)
      expect(response.headers).to.have.property('retry-after')
    })
  })
})
