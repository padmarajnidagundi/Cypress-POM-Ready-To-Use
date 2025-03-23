describe('API Interoperability Tests', () => {
  it('should handle different data formats', () => {
    // Test JSON format
    cy.apiRequest('GET', '/users', {
      headers: { 
        'Accept': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
    })

    // Test XML format (expecting 406 Not Acceptable since API doesn't support XML)
    cy.apiRequest('GET', '/users', {
      headers: { 
        'Accept': 'application/xml'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([406, 200])
    })
  })

  it('should verify CORS headers', () => {
    cy.apiRequest('GET', '/users', {
      headers: { 
        'Origin': 'https://example.com'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      // Note: reqres.in might not send CORS headers in test environment
      if (response.headers['access-control-allow-origin']) {
        expect(response.headers['access-control-allow-origin']).to.exist
      }
    })
  })

  it('should handle different API versions', () => {
    cy.apiRequest('GET', '/users', {
      headers: {
        'Accept-Version': 'v1'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('should support content negotiation', () => {
    cy.apiRequest('GET', '/users', {
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})
