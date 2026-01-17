/**
 * Retry Utilities
 * Helper functions for handling retries and flaky tests
 */

class RetryHelpers {
  /**
   * Retry a function until it succeeds or max attempts reached
   * @param {Function} fn - Function to retry
   * @param {number} maxAttempts - Maximum retry attempts
   * @param {number} delay - Delay between retries (ms)
   */
  static async retryUntilSuccess(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error
        }
        await this.wait(delay)
      }
    }
  }

  /**
   * Wait for specified time
   * @param {number} ms - Milliseconds to wait
   */
  static wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Retry API request with exponential backoff
   * @param {Function} requestFn - Request function
   * @param {number} maxAttempts - Maximum retry attempts
   */
  static retryApiRequest(requestFn, maxAttempts = 3) {
    return cy.wrap(null).then(async () => {
      let lastError

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await requestFn()
        } catch (error) {
          lastError = error
          const backoffTime = Math.pow(2, attempt) * 1000
          await this.wait(backoffTime)
        }
      }

      throw lastError
    })
  }
}

export default RetryHelpers
