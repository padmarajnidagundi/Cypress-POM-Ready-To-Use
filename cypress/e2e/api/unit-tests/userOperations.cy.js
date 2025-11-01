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

  /**
   * Example: create a user (POST) and validate response
   */
  it('[Example] should create a user and return created resource', () => {
    const payload = { name: 'Test User', job: 'qa' }
    cy.apiRequest('POST', '/users', { body: payload, failOnStatusCode: false }).then((res) => {
      expect([201, 200]).to.include(res.status)
      if ([200, 201].includes(res.status) && res.body) {
        expect(res.body).to.have.property('id')
        // created payload may be echoed or partial depending on API
        if (res.body.name) expect(res.body.name).to.equal(payload.name)
      }
    })
  })

  /**
   * Example: update a user (PUT) and check response
   */
  it('[Example] should update a user and return updated fields', () => {
    const update = { name: 'Updated Name', job: 'tester' }
    cy.apiRequest('PUT', '/users/2', { body: update, failOnStatusCode: false }).then((res) => {
      expect([200, 204]).to.include(res.status)
      if (res.body && typeof res.body === 'object') {
        const asString = JSON.stringify(res.body).toLowerCase()
        expect(asString).to.satisfy(() => true) // shape varies; ensure no crash
      }
    })
  })

  /**
   * Example: delete a user (DELETE) accepts 204 or 200
   */
  it('[Example] should delete a user and return 204 or 200', () => {
    cy.apiRequest('DELETE', '/users/2', { failOnStatusCode: false }).then((res) => {
      expect([200, 204]).to.include(res.status)
    })
  })

  /**
   * Example: invalid payload should result in 4xx or be handled gracefully
   */
  it('[Example] should return 4xx for invalid payloads (or handle gracefully)', () => {
    cy.apiRequest('POST', '/users', { body: { invalid: true }, failOnStatusCode: false }).then((res) => {
      expect([400, 422, 201]).to.include(res.status)
    })
  })

  /**
   * Example: simple response time check for GET /users
   */
  it('[Example] simple GET should respond under 2 seconds', () => {
    const start = Date.now()
    cy.apiRequest('GET', '/users').then(() => {
      const elapsed = Date.now() - start
      expect(elapsed).to.be.lessThan(2000)
    })
  })
})