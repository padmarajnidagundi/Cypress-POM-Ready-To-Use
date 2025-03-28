describe('API Validation Tests', () => {
  it('should validate required fields for register', () => {
    cy.apiRequest('POST', '/register', {
      body: {}  // Empty body to test required fields
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error', 'Missing email or username')
    })
  })

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

    testCases.forEach(testCase => {
      cy.apiRequest('POST', '/register', {
        body: testCase.data
      }).then((response) => {
        expect(response.status).to.eq(testCase.expectedStatus)
      })
    })
  })

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
})
