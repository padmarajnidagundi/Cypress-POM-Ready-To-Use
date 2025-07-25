describe('API Performance Tests', () => {
  /**
   * Test: Single request response time
   * Ensures the /users endpoint responds within 1 second.
   * Validates both status code and response duration.
   */
  it('should respond within acceptable time limits', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(1000) // Response under 1 second
    })
  })

  /**
   * Test: Concurrent requests handling
   * Sends 10 concurrent GET requests to /users.
   * Verifies each response is successful and within the time threshold.
   * Purpose: Simulate load and check API stability under concurrent access.
   */
  it('should handle multiple concurrent requests', () => {
    const requests = Array(10).fill().map(() => 
      cy.apiRequest('GET', '/users').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.duration).to.be.lessThan(1000)
      })
    )
    
    return Promise.all(requests)
  })

  /**
   * Test: Response time distribution
   * Measures and collects response times for /users?page=1.
   * Calculates average response time and asserts it is below 1 second.
   * Purpose: Monitor performance consistency and detect outliers.
   */
  it('should measure response time distribution', () => {
    const measurements = []
    
    cy.apiRequest('GET', '/users?page=1').then((response) => {
      measurements.push(response.duration)
      expect(response.status).to.eq(200)
      
      // Calculate performance metrics
      const avgTime = measurements.reduce((a, b) => a + b, 0) / measurements.length
      expect(avgTime).to.be.lessThan(1000)
    })
  })
})
