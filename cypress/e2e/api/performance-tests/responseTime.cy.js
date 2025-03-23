describe('[Performance] API Response Times', () => {
  it('[Performance] should meet response time SLA', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(1000) // Response under 1 second
    })
  })

  it('[Performance] should handle concurrent API requests', () => {
    const requests = Array(10).fill().map(() => 
      cy.apiRequest('GET', '/users').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.duration).to.be.lessThan(1000)
      })
    )
    
    return Promise.all(requests)
  })
})