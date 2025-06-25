describe('API Negative Tests', () => {
  describe('Authentication Tests', () => {
    it('should reject invalid credentials', () => {
      cy.apiLoginWithInvalidCredentials('invalid@email.com', 'wrongpassword')
        .then(response => {
          expect(response.status).to.eq(401)
          expect(response.body).to.have.property('error')
        })
    })

    it('should handle expired tokens', () => {
      cy.useExpiredToken()
        .then(response => {
          expect(response.status).to.eq(401)
          expect(response.body.error).to.equal('Token expired')
        })
    })
  })

  describe('User Creation Validation', () => {
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

  describe('Error Handling', () => {
    it('should handle server errors gracefully', () => {
      cy.simulateNetworkError('GET', '/users', 'SERVER_ERROR')
      cy.apiRequest('GET', '/users')
        .then(response => {
          expect(response.status).to.eq(500)
          expect(response.body.error).to.equal('Internal Server Error')
        })
    })

    it('should handle rate limiting', () => {
      cy.exhaustRateLimit('/users', 15)
        .then(responses => {
          const lastResponse = responses[responses.length - 1]
          expect(lastResponse.status).to.eq(429)
          expect(lastResponse.body.error).to.contain('Too Many Requests')
        })
    })
  })

  describe('Permission Tests', () => {
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

  describe('Edge Cases', () => {
    it('should handle empty request bodies', () => {
      cy.apiRequest('POST', '/users', {
        body: {}
      }).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.contain('empty')
      })
    })

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
