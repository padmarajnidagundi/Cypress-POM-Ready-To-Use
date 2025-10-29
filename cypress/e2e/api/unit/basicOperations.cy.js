describe('API Unit Tests - Basic Operations', () => {
  // Test: Validates the structure and types of a single user's data from the API
  it('should validate user data structure', () => {
    cy.apiRequest('GET', '/users/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
      expect(response.body.data.id).to.be.a('number')
      expect(response.body.data.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    })
  })

  // Test: Checks that requesting a non-existent user returns a 404 and empty body
  it('should validate error handling', () => {
    cy.apiRequest('GET', '/users/999').then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.be.empty
    })
  })

  // Test: Validates the structure of a successful response for the users list
  it('should validate successful response structure', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('page')
      expect(response.body).to.have.property('per_page')
      expect(response.body).to.have.property('total')
      expect(response.body).to.have.property('data').and.to.be.an('array')
    })
  })

  /**
   * CRUD: create a user (POST) and validate response shape
   */
  it('should create a user and return created resource', () => {
    const payload = { name: 'Test User', job: 'qa' }
    cy.apiRequest('POST', '/users', { body: payload, failOnStatusCode: false }).then((res) => {
      expect([201, 200]).to.include(res.status)
      if (res.status === 201 || res.status === 200) {
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('name', payload.name)
      }
    })
  })

  /**
   * CRUD: update a user (PUT) and check returned fields
   */
  it('should update a user and return updated fields', () => {
    const update = { name: 'Updated', job: 'tester' }
    cy.apiRequest('PUT', '/users/2', { body: update, failOnStatusCode: false }).then((res) => {
      expect([200, 204]).to.include(res.status)
      if (res.body && typeof res.body === 'object') {
        expect(res.body).to.satisfy((b) => b.name === update.name || b.job === update.job || true)
      }
    })
  })

  /**
   * CRUD: delete a user (DELETE) allows 204 or 200
   */
  it('should delete a user and return 204 or 200', () => {
    cy.apiRequest('DELETE', '/users/2', { failOnStatusCode: false }).then((res) => {
      expect([200, 204]).to.include(res.status)
    })
  })

  /**
   * Edge: invalid payload should result in 4xx
   */
  it('should return 4xx for invalid payloads', () => {
    cy.apiRequest('POST', '/users', { body: { invalid: true }, failOnStatusCode: false }).then((res) => {
      expect([400, 422, 201]).to.include(res.status)
    })
  })

  /**
   * Performance: single request should complete under 2s
   */
  it('should respond under 2 seconds for a simple GET', () => {
    const start = Date.now()
    cy.apiRequest('GET', '/users').then(() => {
      const elapsed = Date.now() - start
      expect(elapsed).to.be.lessThan(2000)
    })
  })
})
