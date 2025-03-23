describe('API Integration Tests - User Workflow', () => {
  let userId;

  it('should complete full user lifecycle', () => {
    // Create user
    cy.apiRequest('POST', '/users', {
      body: {
        name: 'Test User',
        job: 'QA Engineer'
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      userId = response.body.id
      
      // Update user
      return cy.apiRequest('PUT', `/users/${userId}`, {
        body: {
          name: 'Updated User',
          job: 'Senior QA'
        }
      })
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.name).to.eq('Updated User')
      
      // Delete user
      return cy.apiRequest('DELETE', `/users/${userId}`)
    }).then((response) => {
      expect(response.status).to.eq(204)
    })
  })

  it('should validate user authentication flow', () => {
    cy.apiRequest('POST', '/login', {
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('token')
      
      const token = response.body.token
      return cy.apiRequest('GET', '/users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
        }
      })
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})
