/**
 * Integration test suite for User Management API
 * Tests comprehensive user lifecycle operations and authentication flows
 * Validates CRUD operations and token-based authentication
 */
describe('[Integration] User Management Workflow', () => {
  /**
   * Tests the complete CRUD (Create, Read, Update, Delete) lifecycle for a user
   *
   * Flow:
   * 1. CREATE - Creates a new user with initial role
   * 2. UPDATE - Modifies user information and role
   * 3. DELETE - Removes user from the system
   *
   * Validates:
   * - Correct status codes for each operation
   * - Response data integrity
   * - Proper cleanup of user data
   */
  it('[Integration] should perform complete user CRUD operations', () => {
    let userId

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

        // Update user with new role and information
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

        // Clean up by removing test user
        return cy.apiRequest('DELETE', `/users/${userId}`)
      })
      .then((response) => {
        expect(response.status).to.eq(204)
      })
  })

  /**
   * Tests the authentication workflow for users
   *
   * Flow:
   * 1. Login attempt with valid credentials
   * 2. Token verification and extraction
   * 3. Authenticated API request using token
   *
   * Validates:
   * - Successful authentication
   * - Token generation and structure
   * - Protected endpoint access with token
   */
  it('[Integration] should handle user authentication flow', () => {
    // Attempt authentication with valid credentials
    cy.apiRequest('POST', '/login', {
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')

        // Use authentication token for protected endpoint access
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
