describe('[Unit] User API Operations', () => {
  // Test: Should retrieve a single user and validate the response data structure and types
  it('[Unit] should retrieve user with valid data structure', () => {
    cy.apiRequest('GET', '/users/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
      expect(response.body.data.id).to.be.a('number')
      expect(response.body.data.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    })
  })

  // Test: Should handle request for a non-existent user and return 404 with empty body
  it('[Unit] should handle non-existent user request', () => {
    cy.apiRequest('GET', '/users/999').then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.be.empty
    })
  })

  // Test: Should verify the structure of the users list response
  it('[Unit] should verify users list response structure', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('page')
      expect(response.body).to.have.property('per_page')
      expect(response.body).to.have.property('total')
      expect(response.body).to.have.property('data').and.to.be.an('array')
    })
  })
})