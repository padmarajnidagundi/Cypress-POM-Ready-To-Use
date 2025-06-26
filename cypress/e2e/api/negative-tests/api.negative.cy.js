/**
 * Negative Test Suite for API Endpoints
 * Tests various error scenarios and edge cases to ensure robust error handling
 */
describe('API Negative Tests', () => {
  /**
   * Authentication Related Tests
   * Verifies that the system properly handles invalid authentication attempts
   * and various authentication token scenarios
   */
  describe('Authentication Tests', () => {
    /**
     * Tests the system's response to invalid login credentials
     * Expected: 401 Unauthorized with appropriate error message
     */
    it('should reject invalid credentials', () => {
      cy.apiLoginWithInvalidCredentials('invalid@email.com', 'wrongpassword')
        .then(response => {
          expect(response.status).to.eq(401)
          expect(response.body).to.have.property('error')
        })
    })

    /**
     * Verifies handling of expired authentication tokens
     * Expected: 401 Unauthorized with "Token expired" message
     */
    it('should handle expired tokens', () => {
      cy.useExpiredToken()
        .then(response => {
          expect(response.status).to.eq(401)
          expect(response.body.error).to.equal('Token expired')
        })
    })
  })

  /**
   * User Creation Validation Tests
   * Verifies that the API properly validates user data and handles
   * various invalid input scenarios during user creation
   */
  describe('User Creation Validation', () => {
    /**
     * Tests validation of malformed user data
     * Checks: Missing required fields, invalid format, empty values
     * Expected: 422 Unprocessable Entity with validation details
     */
    it('should reject malformed user data', () => {
      cy.createMalformedUser()
        .then(invalidUser => {
          cy.apiRequest('POST', '/users', {
            body: invalidUser
          }).then(response => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property('details')
            expect(response.body.details).to.have.length.greaterThan(0)
          })
        })
    })

    /**
     * Tests prevention of duplicate user creation
     * Checks: Duplicate email, username conflicts
     * Expected: 409 Conflict with appropriate error message
     */
    it('should prevent duplicate user creation', () => {
      // Create initial user
      cy.createTestUser().then(user => {
        cy.apiRequest('POST', '/users', { body: user })
          
        // Attempt to create duplicate
        cy.createDuplicateUser(user)
          .then(duplicateUser => {
            cy.apiRequest('POST', '/users', {
              body: duplicateUser
            }).then(response => {
              expect(response.status).to.eq(409) // Conflict
              expect(response.body.error).to.contain('already exists')
            })
          })
      })
    })

    /**
     * Tests bulk validation of invalid user data
     * Verifies consistent error handling across multiple invalid records
     * Expected: 422 status for each invalid user
     */
    it('should validate multiple invalid users', () => {
      cy.createInvalidUsers(3, 'invalid_format')
        .then(invalidUsers => {
          invalidUsers.forEach(user => {
            cy.apiRequest('POST', '/users', {
              body: user
            }).then(response => {
              expect(response.status).to.eq(422)
            })
          })
        })
    })
  })

  /**
   * Error Handling Tests
   * Verifies that the API handles various error conditions gracefully
   */
  describe('Error Handling', () => {
    /**
     * Tests handling of server-side errors
     * Simulates 500 Internal Server Error responses
     * Expected: Graceful error handling with appropriate message
     */
    it('should handle server errors gracefully', () => {
      cy.simulateNetworkError('GET', '/users', 'SERVER_ERROR')
      cy.apiRequest('GET', '/users')
        .then(response => {
          expect(response.status).to.eq(500)
          expect(response.body.error).to.equal('Internal Server Error')
        })
    })

    /**
     * Tests rate limiting functionality
     * Verifies that the API enforces rate limits and provides appropriate responses
     * Expected: 429 Too Many Requests after limit is exceeded
     */
    it('should handle rate limiting', () => {
      cy.exhaustRateLimit('/users', 15)
        .then(responses => {
          const lastResponse = responses[responses.length - 1]
          expect(lastResponse.status).to.eq(429)
          expect(lastResponse.body.error).to.contain('Too Many Requests')
        })
    })
  })

  /**
   * Permission and Authorization Tests
   * Verifies that the API properly enforces access controls
   */
  describe('Permission Tests', () => {
    /**
     * Tests access control for admin endpoints
     * Verifies that non-admin users cannot access restricted endpoints
     * Expected: 403 Forbidden for unauthorized access attempts
     */
    it('should prevent unauthorized access to admin endpoints', () => {
      cy.createTestUser({}, UserTypes.GUEST)
        .then(user => {
          cy.apiRequest('GET', '/admin/users', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }).then(response => {
            expect(response.status).to.eq(403)
            expect(response.body.error).to.equal('Forbidden')
          })
        })
    })

    /**
     * Tests field validation across different user types
     * Verifies that each user type has appropriate field requirements
     * Expected: 422 with specific validation errors per user type
     */
    it('should validate required fields for different user types', () => {
      const userTypes = [UserTypes.ADMIN, UserTypes.REGULAR, UserTypes.GUEST]
      
      userTypes.forEach(type => {
        cy.createInvalidUsers(1, 'missing_fields')
          .then(([invalidUser]) => {
            cy.apiRequest('POST', `/users/${type}`, {
              body: invalidUser
            }).then(response => {
              expect(response.status).to.eq(422)
              expect(response.body.details).to.not.be.empty
            })
          })
      })
    })
  })

  /**
   * Edge Cases and Special Scenarios
   * Tests handling of unusual or extreme input conditions
   */
  describe('Edge Cases', () => {
    /**
     * Tests handling of empty request bodies
     * Verifies that the API properly validates against empty requests
     * Expected: 400 Bad Request with appropriate error message
     */
    it('should handle empty request bodies', () => {
      cy.apiRequest('POST', '/users', {
        body: {}
      }).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.contain('empty')
      })
    })

    /**
     * Tests handling of malformed JSON in requests
     * Verifies proper error handling for invalid JSON syntax
     * Expected: 400 Bad Request with JSON parsing error message
     */
    it('should handle malformed JSON', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/users`,
        body: 'invalid-json{',
        headers: {
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.contain('JSON')
      })
    })

    /**
     * Tests field length validation
     * Verifies that the API enforces maximum field lengths
     * Expected: 422 with validation errors for oversized fields
     */
    it('should validate maximum field lengths', () => {
      cy.createTestUser({
        username: 'a'.repeat(256), // Exceeding maximum length
        password: 'a'.repeat(1024) // Exceeding maximum length
      }).then(user => {
        cy.apiRequest('POST', '/users', {
          body: user
        }).then(response => {
          expect(response.status).to.eq(422)
          expect(response.body.details).to.have.length(2) // Two validation errors
        })
      })
    })
  })
})
