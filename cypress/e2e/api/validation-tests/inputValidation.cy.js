describe('[Validation] API Input Validation', () => {
  // Test: Should return 400 and error message when required fields are missing in register
  it('[Validation] should enforce required fields', () => {
    cy.apiRequest('POST', '/register', {
      body: {}  // Empty body to test required fields
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error', 'Missing email or username')
    })
  })

  // Test: Should validate email format and required password for registration
  it('[Validation] should validate email format', () => {
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
    testCases.forEach(testCase => {
      cy.apiRequest('POST', '/register', {
        body: testCase.data
      }).then((response) => {
        expect(response.status).to.eq(testCase.expectedStatus)
      })
    })
  })
})