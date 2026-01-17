/**
 * Custom Assertion Helpers
 * Reusable assertion functions for common test scenarios
 */

class AssertionHelpers {
  /**
   * Assert API response structure
   * @param {object} response - Response object
   * @param {number} expectedStatus - Expected status code
   * @param {string[]} requiredFields - Required fields in response body
   */
  static assertApiResponse(response, expectedStatus = 200, requiredFields = []) {
    expect(response.status).to.eq(expectedStatus)
    expect(response.body).to.exist

    if (requiredFields.length > 0) {
      requiredFields.forEach((field) => {
        expect(response.body).to.have.property(field)
      })
    }
  }

  /**
   * Assert response time is within threshold
   * @param {object} response - Response object
   * @param {number} maxTime - Maximum response time in ms
   */
  static assertResponseTime(response, maxTime = 2000) {
    expect(response.duration).to.be.lessThan(maxTime)
  }

  /**
   * Assert element visibility and state
   * @param {string} selector - Element selector
   * @param {object} options - Visibility options
   */
  static assertElementState(selector, options = {}) {
    const { visible = true, enabled = true, text = null, hasClass = null } = options

    cy.get(selector).then(($element) => {
      if (visible) {
        cy.wrap($element).should('be.visible')
      } else {
        cy.wrap($element).should('not.be.visible')
      }

      if (enabled !== null) {
        enabled ? cy.wrap($element).should('be.enabled') : cy.wrap($element).should('be.disabled')
      }

      if (text) {
        cy.wrap($element).should('contain.text', text)
      }

      if (hasClass) {
        cy.wrap($element).should('have.class', hasClass)
      }
    })
  }

  /**
   * Assert array contains expected items
   * @param {Array} array - Array to check
   * @param {Array} expectedItems - Expected items
   */
  static assertArrayContains(array, expectedItems) {
    expect(array).to.be.an('array')
    expectedItems.forEach((item) => {
      expect(array).to.include(item)
    })
  }

  /**
   * Assert object structure matches schema
   * @param {object} obj - Object to validate
   * @param {object} schema - Expected schema
   */
  static assertObjectSchema(obj, schema) {
    Object.keys(schema).forEach((key) => {
      expect(obj).to.have.property(key)

      const expectedType = schema[key]
      const actualValue = obj[key]

      if (expectedType === 'string') {
        expect(actualValue).to.be.a('string')
      } else if (expectedType === 'number') {
        expect(actualValue).to.be.a('number')
      } else if (expectedType === 'boolean') {
        expect(actualValue).to.be.a('boolean')
      } else if (expectedType === 'array') {
        expect(actualValue).to.be.an('array')
      } else if (expectedType === 'object') {
        expect(actualValue).to.be.an('object')
      }
    })
  }

  /**
   * Assert error response format
   * @param {object} response - Response object
   * @param {number} expectedStatus - Expected error status
   * @param {string} errorMessage - Expected error message pattern
   */
  static assertErrorResponse(response, expectedStatus, errorMessage = null) {
    expect(response.status).to.eq(expectedStatus)
    expect(response.body).to.have.property('error')

    if (errorMessage) {
      expect(response.body.error).to.include(errorMessage)
    }
  }

  /**
   * Assert pagination structure
   * @param {object} response - Response object
   * @param {object} expectedPagination - Expected pagination properties
   */
  static assertPagination(response, expectedPagination = {}) {
    const { page, perPage, total, totalPages } = expectedPagination

    expect(response.body).to.have.property('data')
    expect(response.body.data).to.be.an('array')

    if (page) expect(response.body).to.have.property('page', page)
    if (perPage) expect(response.body).to.have.property('per_page', perPage)
    if (total) expect(response.body).to.have.property('total', total)
    if (totalPages) expect(response.body).to.have.property('total_pages', totalPages)
  }

  /**
   * Assert URL contains expected parameters
   * @param {string} expectedPath - Expected path
   * @param {object} expectedParams - Expected query parameters
   */
  static assertUrlParams(expectedPath = null, expectedParams = {}) {
    cy.url().then((url) => {
      if (expectedPath) {
        expect(url).to.include(expectedPath)
      }

      Object.keys(expectedParams).forEach((param) => {
        expect(url).to.include(`${param}=${expectedParams[param]}`)
      })
    })
  }

  /**
   * Assert form validation
   * @param {string} inputSelector - Input field selector
   * @param {string} errorSelector - Error message selector
   * @param {string} expectedError - Expected error message
   */
  static assertFormValidation(inputSelector, errorSelector, expectedError) {
    cy.get(inputSelector).should('have.class', 'invalid').or('have.attr', 'aria-invalid', 'true')
    cy.get(errorSelector).should('be.visible').and('contain.text', expectedError)
  }

  /**
   * Assert accessibility (basic check)
   * @param {string} selector - Element selector (optional)
   */
  static assertAccessibility(selector = null) {
    if (selector) {
      cy.get(selector).should('have.attr', 'role').and('have.attr', 'aria-label')
    } else {
      cy.get('[role]').should('exist')
    }
  }

  /**
   * Assert local storage item
   * @param {string} key - Storage key
   * @param {string} expectedValue - Expected value
   */
  static assertLocalStorage(key, expectedValue = null) {
    cy.window().then((window) => {
      const value = window.localStorage.getItem(key)
      expect(value).to.exist

      if (expectedValue) {
        expect(value).to.eq(expectedValue)
      }
    })
  }

  /**
   * Assert cookie exists
   * @param {string} name - Cookie name
   * @param {string} expectedValue - Expected cookie value
   */
  static assertCookie(name, expectedValue = null) {
    cy.getCookie(name).should('exist')

    if (expectedValue) {
      cy.getCookie(name).should('have.property', 'value', expectedValue)
    }
  }
}

export default AssertionHelpers
