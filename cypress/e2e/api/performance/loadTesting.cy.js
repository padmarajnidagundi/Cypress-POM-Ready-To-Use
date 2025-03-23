describe('API Performance Tests', () => {
  it('should respond within acceptable time limits', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(1000) // Response under 1 second
    })
  })

  it('should handle multiple concurrent requests', () => {
    const requests = Array(10).fill().map(() => 
      cy.apiRequest('GET', '/users').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.duration).to.be.lessThan(1000)
      })
    )
    
    return Promise.all(requests)
  })

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
