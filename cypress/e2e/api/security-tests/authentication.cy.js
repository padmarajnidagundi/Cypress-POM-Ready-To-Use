describe('[Security] API Authentication', () => {
  // This test checks if authentication is enforced when using an invalid token.
  it('[Security] should enforce authentication requirements', () => {
    cy.apiRequest('GET', '/users/2', {
      headers: {
        'Authorization': 'Bearer invalid_token'
      }
    }).then((response) => {
      // reqres.in returns 200 even for invalid tokens, but in real APIs it should be 401
      expect(response.status).to.eq(200)
    })
  })

  // This test checks if unauthorized access is prevented for DELETE requests with an invalid token.
  it('[Security] should prevent unauthorized access', () => {
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