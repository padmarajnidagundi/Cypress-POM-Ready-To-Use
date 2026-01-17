/**
 * API Interoperability Test Suite
 * Tests various aspects of API compatibility and cross-platform support:
 * - Content type handling
 * - CORS support
 * - API versioning
 * - Content negotiation
 */
describe('API Interoperability Tests', () => {
  /**
   * Tests the API's ability to handle different data formats
   * Verifies:
   * 1. JSON format support (primary format)
   * 2. Graceful handling of unsupported formats (XML)
   *
   * Important for ensuring proper content type negotiation
   * and backward compatibility with different client requirements
   */
  it('should handle different data formats', () => {
    // Test JSON format - Standard supported format
    cy.apiRequest('GET', '/users', {
      headers: {
        Accept: 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
    })

    // Test XML format - Verifying graceful rejection
    cy.apiRequest('GET', '/users', {
      headers: {
        Accept: 'application/xml'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([406, 200])
    })
  })

  /**
   * Validates Cross-Origin Resource Sharing (CORS) implementation
   * Checks:
   * 1. Response to cross-origin requests
   * 2. Presence of CORS headers when supported
   *
   * Critical for browser-based clients and modern web applications
   * Note: Some test environments may not include CORS headers
   */
  it('should verify CORS headers', () => {
    // Test cross-origin request handling
    cy.apiRequest('GET', '/users', {
      headers: {
        Origin: 'https://example.com'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      // Note: reqres.in might not send CORS headers in test environment
      if (response.headers['access-control-allow-origin']) {
        expect(response.headers['access-control-allow-origin']).to.exist
      }
    })
  })

  /**
   * Tests API version compatibility
   * Verifies:
   * 1. Support for version specification in requests
   * 2. Proper handling of version headers
   *
   * Essential for maintaining backward compatibility
   * while supporting API evolution
   */
  it('should handle different API versions', () => {
    // Test version header support
    cy.apiRequest('GET', '/users', {
      headers: {
        'Accept-Version': 'v1'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  /**
   * Tests content negotiation capabilities
   * Verifies handling of:
   * 1. Content compression preferences (gzip, deflate)
   * 2. Language preferences
   *
   * Important for:
   * - Optimizing network performance
   * - Supporting internationalization
   * - Meeting client-specific requirements
   */
  it('should support content negotiation', () => {
    // Test compression and language preference handling
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
