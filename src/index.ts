#!/usr/bin/env node

// ClickUp MCP Server — Full project management through AI
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ClickUpClient } from "./clickup-client.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerSpaceTools } from "./tools/spaces.js";
import { registerListTools } from "./tools/lists.js";
import { registerCommentTools } from "./tools/comments.js";
import { registerTimeTrackingTools } from "./tools/time-tracking.js";
import { registerGoalTools } from "./tools/goals.js";
import { registerWebhookTools } from "./tools/webhooks.js";

function getConfig() {
  const apiToken = process.env.CLICKUP_API_TOKEN;

  if (!apiToken) {
    console.error("Error: CLICKUP_API_TOKEN environment variable is required.");
    console.error("Get your API token at: https://app.clickup.com/settings/apps");
    process.exit(1);
  }

  return { apiToken };
}

async function main() {
  const config = getConfig();
  const client = new ClickUpClient(config);

  const server = new McpServer({
    name: "@dev2production/clickup-mcp-server",
    version: "1.0.0",
  });

  // Register all tool groups
  registerTaskTools(server, client);
  registerSpaceTools(server, client);
  registerListTools(server, client);
  registerCommentTools(server, client);
  registerTimeTrackingTools(server, client);
  registerGoalTools(server, client);
  registerWebhookTools(server, client);

  // Start the server on stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
