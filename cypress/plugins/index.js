/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Try to start GitHub MCP server if the package is available.
  // This is guarded so CI or machines without the package won't fail.
  try {
    const { startMcpServer } = require('github-mcp-server')
    const port = process.env.CYPRESS_MCP_PORT ? Number(process.env.CYPRESS_MCP_PORT) : 3001
    startMcpServer({ port })
    // optional: expose the MCP base URL in config for tests
    config.env = config.env || {}
    config.env.MCP_BASE_URL = `http://localhost:${port}`
  } catch (err) {
    // package not installed or failed to start — continue silently
    // You can log if desired, but avoid failing the plugin load
    // console.warn('github-mcp-server not started:', err.message)
  }

  // Expose a simple task that can be used by tests to check MCP availability or perform quick actions.
  on('task', {
    mcpHealthCheck() {
      // Minimal health check; tests can call this task and handle null/ok accordingly.
      // If you have more logic (HTTP check to MCP_BASE_URL) add it here.
      return { ok: true }
    }
  })

  // return the (possibly modified) config
  return config
}
