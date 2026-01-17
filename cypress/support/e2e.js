// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './commands/api.commands'
import 'cypress-axe'
import { configureAxe } from 'cypress-axe'

// Configure aXe
configureAxe({
  rules: [
    { id: 'color-contrast', enabled: true },
    { id: 'landmark-one-main', enabled: true }
  ]
})

// Add custom command for checking accessibility
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe()
  cy.checkA11y(context, options)
})

// Global error handler
Cypress.on('uncaught:exception', (err, _runnable) => {
  // Log the error for debugging
  cy.log('Uncaught exception:', err.message)

  // Prevent test failure for certain expected errors
  const expectedErrors = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Script error',
    'Network request failed'
  ]

  // Don't fail test if it's an expected error
  if (expectedErrors.some((expected) => err.message.includes(expected))) {
    return false
  }

  // Take screenshot on unexpected errors
  cy.screenshot(`error-${Date.now()}`)

  // Allow test to continue unless in CI
  return !Cypress.env('CI')
})

// Global before hook - runs before all tests
before(() => {
  cy.log('🚀 Starting test suite execution')

  // Clear browser state
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Global after hook - runs after all tests
after(() => {
  cy.log('✅ Test suite execution completed')
})

// Global beforeEach hook
beforeEach(() => {
  // Preserve certain cookies/local storage if needed
  // Cypress.Cookies.preserveOnce('session_id', 'auth_token')

  // Set default viewport if not specified
  if (!Cypress.config('viewportWidth')) {
    cy.viewport(1920, 1080)
  }
})

// Global afterEach hook
afterEach(function () {
  // Take screenshot on test failure
  if (this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '-')
    cy.screenshot(`failed-${testName}-${Date.now()}`)
  }
})

// Handle test retries
Cypress.on('test:after:run', (test) => {
  if (test.state === 'failed' && test.currentRetry() < test.retries()) {
    cy.log(`⚠️ Test failed. Retrying... (${test.currentRetry() + 1}/${test.retries()})`)
  }
})

// Network error handling
Cypress.on('fail', (error, runnable) => {
  // Handle specific network errors
  if (
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('Network Error')
  ) {
    cy.log('⚠️ Network error detected:', error.message)

    // Add additional debugging info
    cy.task(
      'log',
      {
        level: 'error',
        message: `Network error in test: ${runnable.title}`,
        error: error.message
      },
      { log: false }
    ).catch(() => {
      // Ignore if task not available
    })
  }

  throw error
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
