/**
 * Integration test suite for user-related API workflows
 * Tests end-to-end user lifecycle and authentication flows
 * Using reqres.in API for demonstration
 */
describe('API Integration Tests - User Workflow', () => {
  let userId

  /**
   * Tests the complete user lifecycle including:
   * 1. User creation (POST /users)
   * 2. User update (PUT /users/{id})
   * 3. User deletion (DELETE /users/{id})
   *
   * Verifies proper status codes and response data
   * at each step of the workflow
   */
  it('should complete full user lifecycle', () => {
    // Create user with initial data
    cy.apiRequest('POST', '/users', {
      body: {
        name: 'Test User',
        job: 'QA Engineer'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(201)
        userId = response.body.id

        // Update user with new information
        return cy.apiRequest('PUT', `/users/${userId}`, {
          body: {
            name: 'Updated User',
            job: 'Senior QA'
          }
        })
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.name).to.eq('Updated User')

        // Clean up by deleting the user
        return cy.apiRequest('DELETE', `/users/${userId}`)
      })
      .then((response) => {
        expect(response.status).to.eq(204)
      })
  })

  /**
   * Tests the user authentication flow:
   * 1. Login with valid credentials (POST /login)
   * 2. Verify token generation
   * 3. Use token for authenticated request (GET /users)
   *
   * Ensures proper authentication and authorization
   * using JWT token-based authentication
   */
  it('should validate user authentication flow', () => {
    // Attempt login with valid credentials
    cy.apiRequest('POST', '/login', {
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')

        // Use received token for authenticated request
        const token = response.body.token
        return cy.apiRequest('GET', '/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      })
      .then((response) => {
        expect(response.status).to.eq(200)
      })
  })
})
