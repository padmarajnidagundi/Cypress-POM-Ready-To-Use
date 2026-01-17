const { defineConfig } = require('cypress')

module.exports = defineConfig({
  watchForFileChanges: false,
  video: process.env.CI ? true : false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  screenshotsFolder: 'mochawesome-report/assets',
  chromeWebSecurity: false,
  firefoxGcInterval: {
    runMode: null,
    openMode: null
  },
  retries: {
    runMode: process.env.CI ? 2 : 0,
    openMode: 0
  },
  execTimeout: 60000,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  requestTimeout: 10000,
  responseTimeout: 30000,
  screenshotOnRunFailure: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Cypress POM Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/reports/html',
    overwrite: false,
    html: true,
    json: true
  },
  env: {
    apiUrl: 'https://reqres.in/api',
    reactAppUrl: 'https://react-redux.realworld.io',
    exampleUrl: 'https://example.cypress.io',
    chatGptUrl: 'https://chat.openai.com',
    chatGptApiUrl: 'https://api.openai.com/v1',
    testType: {
      api: 'cypress/e2e/api',
      ui: 'cypress/e2e/ui',
      integration: 'cypress/e2e/integration'
    },
    visualRegressionPath: 'cypress/snapshots',
    visualThreshold: 0.1
  },
  e2e: {
    baseUrl: 'https://reqres.in/api', // Moved baseUrl here
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      require('cypress-image-snapshot/plugin')(on, config)
      return require('./cypress/plugins/index.js')(on, config)
    }
  }
})
