describe('API Unit Tests - Basic Operations', () => {
  it('should validate user data structure', () => {
    cy.apiRequest('GET', '/users/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
      expect(response.body.data.id).to.be.a('number')
      expect(response.body.data.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    })
  })

  it('should validate error handling', () => {
    cy.apiRequest('GET', '/users/999').then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.be.empty
    })
  })

  it('should validate successful response structure', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('page')
      expect(response.body).to.have.property('per_page')
      expect(response.body).to.have.property('total')
      expect(response.body).to.have.property('data').and.to.be.an('array')
    })
  })
})
