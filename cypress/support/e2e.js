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

// Alternatively you can use CommonJS syntax:
// require('./commands')
