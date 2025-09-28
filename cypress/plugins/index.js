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

  // Add MCP Server integration
  const { startMcpServer } = require('github-mcp-server');

  // Start MCP server on a default port (e.g., 3001)
  startMcpServer({ port: 3001 });

  // MCP server plugin hook (example)
  on('task', {
    mcpHealthCheck() {
      // Custom logic for MCP server health check can be added here
      return null
    }
  })
}
