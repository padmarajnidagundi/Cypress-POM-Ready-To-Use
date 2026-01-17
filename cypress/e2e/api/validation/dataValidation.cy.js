describe('API Validation Tests', () => {
  // Test: Should return 400 and error message when required fields are missing in register
  it('should validate required fields for register', () => {
    cy.apiRequest('POST', '/register', {
      body: {} // Empty body to test required fields
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error', 'Missing email or username')
    })
  })

  // Test: Should validate email format and required password for registration
  it('should validate email format', () => {
    const testCases = [
      {
        data: { email: 'invalid-email', password: 'password123' },
        expectedStatus: 400
      },
      {
        data: { email: 'eve.holt@reqres.in' }, // Missing password
        expectedStatus: 400
      },
      {
        data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
        expectedStatus: 200
      }
    ]

    // Loop through test cases to check different validation scenarios
    testCases.forEach((testCase) => {
      cy.apiRequest('POST', '/register', {
        body: testCase.data
      }).then((response) => {
        expect(response.status).to.eq(testCase.expectedStatus)
      })
    })
  })

  // Test: Should create a user when minimum required fields are provided
  it('should validate user creation with minimum required fields', () => {
    cy.apiRequest('POST', '/users', {
      body: {
        name: 'morpheus',
        job: 'leader'
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.all.keys('name', 'job', 'id', 'createdAt')
    })
  })

  /**
   * Edge: SQL-injection-like payload should not expose DB errors
   */
  it('should not leak database errors for SQL-injection-like payloads', () => {
    const payload = { name: "' OR 1=1 --", job: 'tester' }
    cy.apiRequest('POST', '/users', { body: payload, failOnStatusCode: false }).then((res) => {
      expect([200, 201, 400, 422]).to.include(res.status)
      if (res.body && typeof res.body === 'string') {
        expect(res.body).to.not.match(/sql|syntax error|ORA-|mysql/i)
      } else if (res.body) {
        expect(JSON.stringify(res.body).toLowerCase()).to.not.include('sql')
      }
    })
  })

  /**
   * Edge: Very large input should be handled (413 or validation error possible)
   */
  it('should handle very large input payloads appropriately', () => {
    const largeName = 'a'.repeat(50_000)
    cy.apiRequest('POST', '/users', { body: { name: largeName }, failOnStatusCode: false }).then(
      (res) => {
        expect([201, 200, 400, 413]).to.include(res.status)
      }
    )
  })

  /**
   * Edge: Duplicate creation behavior (idempotency/duplicate detection)
   */
  it('should handle duplicate user creation attempts defensively', () => {
    const payload = { name: 'duplicate-test', job: 'qa' }
    cy.apiRequest('POST', '/users', { body: payload, failOnStatusCode: false }).then((first) => {
      expect([200, 201, 400]).to.include(first.status)
      cy.apiRequest('POST', '/users', { body: payload, failOnStatusCode: false }).then((second) => {
        // Accept either duplicate allowed (201) or rejected (409/400)
        expect([200, 201, 400, 409]).to.include(second.status)
      })
    })
  })

  /**
   * Edge: Missing Content-Type header handling
   */
  it('should respond appropriately when Content-Type is missing', () => {
    cy.request({
      method: 'POST',
      url: '/users',
      body: { name: 'no-content-type' },
      headers: {}, // intentionally omit Content-Type
      failOnStatusCode: false
    }).then((res) => {
      expect([200, 201, 400, 415]).to.include(res.status)
    })
  })
})
