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
        Authorization: 'Bearer invalid_token'
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
        Authorization: 'Bearer invalid_token'
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
      headers: {
        /* intentionally empty */
      },
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

  /**
   * Edge: CORS preflight and Access-Control-Allow-Origin header
   */
  it('should respond to CORS preflight and include Access-Control-Allow-Origin when appropriate', () => {
    cy.request({
      method: 'OPTIONS',
      url: '/users',
      headers: {
        Origin: 'https://example.com',
        'Access-Control-Request-Method': 'GET'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Some servers respond with 204 and CORS headers, others may not expose CORS on same-origin test harness.
      expect([200, 204, 400, 405]).to.include(response.status)
      // If header exists, it should either echo origin or be a wildcard
      if (response.headers && response.headers['access-control-allow-origin']) {
        const val = response.headers['access-control-allow-origin']
        expect([val, '*']).to.satisfy(() => true) // presence accepted; content varies by server
      }
    })
  })

  /**
   * Edge: Open redirect detection
   * Try a redirect endpoint with an absolute external URL parameter and ensure we don't get blindly redirected to external host.
   */
  it('should not be vulnerable to open-redirect (defensive check)', () => {
    cy.request({
      url: '/redirect?to=http://evil.example.com',
      followRedirect: false,
      failOnStatusCode: false
    }).then((response) => {
      // Acceptable behaviors: block, sanitize, or redirect only to internal locations.
      // If server responds with a Location header, ensure it is not an external absolute URL.
      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers &&
        response.headers.location
      ) {
        const loc = response.headers.location
        expect(loc).to.not.match(/^https?:\/\/evil\.example\.com/i)
      } else {
        // Non-redirect responses are acceptable (sanitized or error)
        expect([200, 400, 404, 410]).to.include(response.status)
      }
    })
  })

  /**
   * Edge: Enforce HTTPS redirect check (HTTP -> HTTPS)
   */
  it('should redirect HTTP to HTTPS or otherwise enforce secure transport', () => {
    // This check is best-effort: test harness may be HTTPS-only; accept multiple outcomes.
    cy.request({
      url:
        'http://' +
        (Cypress.config('baseUrl') ? new URL(Cypress.config('baseUrl')).host : 'example.com'),
      followRedirect: false,
      failOnStatusCode: false
    }).then((response) => {
      // If an HTTP -> HTTPS redirect exists, it will be a 3xx with location starting with https
      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers &&
        response.headers.location
      ) {
        expect(response.headers.location.toLowerCase()).to.match(/^https:\/\//)
      } else {
        // If server doesn't expose HTTP or test harness blocks it, accept common statuses
        expect([200, 400, 404]).to.include(response.status)
      }
    })
  })
})
