module.exports = {
  watchForFileChanges: false,
  video: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  screenshotsFolder: 'mochawesome-report/assets',
  chromeWebSecurity: false,
  firefoxGcInterval: {
    runMode: null,
    openMode: null,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  execTimout: 60000,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  requestTimeout: 10000,
  responseTimeout: 30000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
}
