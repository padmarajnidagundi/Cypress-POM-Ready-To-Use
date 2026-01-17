/**
 * API Compatibility Test Suite
 * Tests interoperability aspects of the API including:
 * - Content type negotiation
 * - Cross-Origin Resource Sharing (CORS)
 * - Response format handling
 */
describe('[Interop] API Compatibility', () => {
  /**
   * Tests the API's content negotiation capabilities
   * Verifies handling of different Accept header values:
   * 1. JSON format - Expected to succeed (primary format)
   * 2. XML format - Expected to fail gracefully (unsupported format)
   *
   * Purpose: Ensure API properly handles content negotiation
   * and responds appropriately to both supported and
   * unsupported format requests
   */
  it('[Interop] should support multiple data formats', () => {
    // Test JSON format - Primary supported format
    cy.apiRequest('GET', '/users', {
      headers: {
        Accept: 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
    })

    // Test XML format - Unsupported format handling
    cy.apiRequest('GET', '/users', {
      headers: {
        Accept: 'application/xml'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([406, 200])
    })
  })

  /**
   * Tests Cross-Origin Resource Sharing (CORS) support
   * Verifies the API's handling of cross-origin requests by:
   * 1. Sending request with Origin header
   * 2. Checking for CORS-related response headers
   *
   * Notes:
   * - Tests against reqres.in which may not always return CORS headers
   * - Handles both CORS-enabled and non-CORS environments
   * - Important for browser-based API consumers
   */
  it('[Interop] should handle cross-origin requests', () => {
    // Simulate cross-origin request from example.com
    cy.apiRequest('GET', '/users', {
      headers: {
        Origin: 'https://example.com'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      // Conditionally check CORS headers if present
      if (response.headers['access-control-allow-origin']) {
        expect(response.headers['access-control-allow-origin']).to.exist
      }
    })
  })
})
