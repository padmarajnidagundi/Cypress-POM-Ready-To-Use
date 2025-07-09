/**
 * Mock API Response Test Suite
 * Demonstrates use of Cypress intercepts for mocking API responses,
 * simulating network conditions, and verifying client behavior.
 */
describe('[Mock] API Response Mocking', () => {
  beforeEach(() => {
    /**
     * Mock GET /users endpoint with static fixture data.
     * Ensures all requests to /users return consistent, predictable data for testing.
     */
    cy.intercept('GET', '**/users*', (req) => {
      req.reply({
        statusCode: 200,
        fixture: 'users.json'
      })
    }).as('getUsers')

    /**
     * Mock GET /users/:id endpoint with dynamic response.
     * Returns a user object based on the requested userId.
     */
    cy.intercept('GET', '**/users/*', (req) => {
      const userId = req.url.split('/').pop()
      req.reply({
        statusCode: 200,
        body: {
          id: parseInt(userId),
          name: 'Mocked User',
          email: `user${userId}@example.com`,
          role: 'test'
        }
      })
    }).as('getUser')

    /**
     * Mock POST /users endpoint to simulate network latency.
     * Adds an artificial delay to test client-side handling of slow responses.
     */
    cy.intercept('POST', '**/users', (req) => {
      req.on('response', (res) => {
        // Add artificial delay
        res.setDelay(1000)
      })
    }).as('createUser')
  })

  /**
   * Verifies that the GET /users endpoint returns the mocked fixture data.
   * Ensures the client can handle a successful mocked response.
   */
  it('[Mock] should handle mocked successful response', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      cy.wait('@getUsers').then((interception) => {
        expect(interception.response.body).to.exist
        expect(interception.response.statusCode).to.eq(200)
      })
    })
  })

  /**
   * Simulates an error response for GET /users and verifies error handling.
   * Overrides the default mock to return a 500 error for this test only.
   */
  it('[Mock] should simulate error responses', () => {
    // Override default mock for this test
    cy.intercept('GET', '**/users', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
        message: 'Simulated server failure'
      }
    }).as('getUsersError')

    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(500)
      expect(response.body.error).to.eq('Internal Server Error')
    })
  })

  /**
   * Verifies that GET /users/:id returns the correct mocked user data based on the requested ID.
   * Ensures dynamic mocking works as expected.
   */
  it('[Mock] should handle dynamic response data', () => {
    cy.apiRequest('GET', '/users/123').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(123)
      expect(response.body.email).to.eq('user123@example.com')
    })
  })

  /**
   * Ensures that the artificial delay for POST /users is respected and measurable.
   * Verifies the client can handle slow network conditions.
   */
  it('[Mock] should verify network conditions', () => {
    const startTime = Date.now()
    
    cy.apiRequest('POST', '/users', {
      body: { name: 'Test User' }
    }).then((response) => {
      const endTime = Date.now()
      const duration = endTime - startTime
      
      expect(duration).to.be.greaterThan(1000) // Verify artificial delay
      cy.wait('@createUser')
    })
  })

  /**
   * Verifies that multiple endpoints can be mocked and intercepted independently.
   * Checks GET /users/:id/posts and GET /users/:id/comments with different fixtures.
   */
  it('[Mock] should stub multiple endpoints', () => {
    // Setup multiple mocks
    cy.intercept('GET', '**/users/*/posts', {
      fixture: 'userPosts.json'
    }).as('getUserPosts')

    cy.intercept('GET', '**/users/*/comments', {
      fixture: 'userComments.json'
    }).as('getUserComments')

    // Test multiple endpoints
    cy.apiRequest('GET', '/users/1/posts')
    cy.wait('@getUserPosts')
    
    cy.apiRequest('GET', '/users/1/comments')
    cy.wait('@getUserComments')
  })
})
