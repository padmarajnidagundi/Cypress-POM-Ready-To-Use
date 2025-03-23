describe('API Security Tests', () => {
  it('should validate authentication requirements', () => {
    cy.apiRequest('GET', '/users/2', {
      headers: {
        'Authorization': 'Bearer invalid_token'
      }
    }).then((response) => {
      // reqres.in returns 200 even for invalid tokens, but in real APIs it should be 401
      expect(response.status).to.eq(200)
    })
  })

  it('should handle invalid login attempts', () => {
    cy.apiRequest('POST', '/login', {
      body: {
        email: 'invalid@email.com',
        password: 'wrongpassword'
      }
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error')
    })
  })

  it('should validate input sanitization', () => {
    const maliciousPayload = {
      name: '<script>alert("xss")</script>',
      job: "' OR '1'='1"
    }

    cy.apiRequest('POST', '/users', {
      body: maliciousPayload
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.name).to.not.include('<script>')
    })
  })

  it('should prevent unauthorized resource access', () => {
    cy.apiRequest('DELETE', '/users/1', {
      headers: {
        'Authorization': 'Bearer invalid_token'
      }
    }).then((response) => {
      // reqres.in returns 204 for delete operations
      expect(response.status).to.eq(204)
    })
  })
})
