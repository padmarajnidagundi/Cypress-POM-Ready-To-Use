describe('[Mock] API Response Mocking', () => {
  beforeEach(() => {
    // Reset intercepts before each test
    cy.intercept('GET', '**/users*', (req) => {
      req.reply({
        statusCode: 200,
        fixture: 'users.json'
      })
    }).as('getUsers')

    // Dynamic response based on query parameters
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

    // Simulate network conditions
    cy.intercept('POST', '**/users', (req) => {
      req.on('response', (res) => {
        // Add artificial delay
        res.setDelay(1000)
      })
    }).as('createUser')
  })

  it('[Mock] should handle mocked successful response', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      cy.wait('@getUsers').then((interception) => {
        expect(interception.response.body).to.exist
        expect(interception.response.statusCode).to.eq(200)
      })
    })
  })

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

  it('[Mock] should handle dynamic response data', () => {
    cy.apiRequest('GET', '/users/123').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(123)
      expect(response.body.email).to.eq('user123@example.com')
    })
  })

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
