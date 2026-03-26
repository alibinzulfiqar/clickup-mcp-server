// ClickUp Webhook Management Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

const WEBHOOK_EVENTS = [
  "taskCreated", "taskUpdated", "taskDeleted", "taskPriorityUpdated",
  "taskStatusUpdated", "taskAssigneeUpdated", "taskDueDateUpdated",
  "taskTagUpdated", "taskMoved", "taskCommentPosted", "taskCommentUpdated",
  "taskTimeEstimateUpdated", "taskTimeTrackedUpdated",
  "listCreated", "listUpdated", "listDeleted",
  "folderCreated", "folderUpdated", "folderDeleted",
  "spaceCreated", "spaceUpdated", "spaceDeleted",
  "goalCreated", "goalUpdated", "goalDeleted",
  "keyResultCreated", "keyResultUpdated", "keyResultDeleted",
] as const;

export function registerWebhookTools(server: McpServer, client: ClickUpClient) {
  // ── Get Webhooks ────────────────────────────────────────
  server.tool(
    "clickup_get_webhooks",
    "List all webhooks configured for a ClickUp workspace",
    {
      team_id: z.string().describe("The workspace/team ID"),
    },
    async ({ team_id }) => {
      const result = await client.getWebhooks(team_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Webhook ──────────────────────────────────────
  server.tool(
    "clickup_create_webhook",
    "Create a new webhook to receive real-time notifications from ClickUp. Supports events like taskCreated, taskUpdated, taskStatusUpdated, etc.",
    {
      team_id: z.string().describe("The workspace/team ID"),
      endpoint: z.string().url().describe("The URL to receive webhook POST requests"),
      events: z.array(z.enum(WEBHOOK_EVENTS)).describe("Array of event types to subscribe to (e.g. ['taskCreated', 'taskUpdated'])"),
      space_id: z.string().optional().describe("Limit webhook to a specific space"),
      folder_id: z.string().optional().describe("Limit webhook to a specific folder"),
      list_id: z.string().optional().describe("Limit webhook to a specific list"),
      task_id: z.string().optional().describe("Limit webhook to a specific task"),
    },
    async ({ team_id, endpoint, events, space_id, folder_id, list_id, task_id }) => {
      const result = await client.createWebhook(team_id, {
        endpoint,
        events: events as string[],
        space_id,
        folder_id,
        list_id,
        task_id,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Update Webhook ──────────────────────────────────────
  server.tool(
    "clickup_update_webhook",
    "Update an existing webhook — change endpoint, events, or status",
    {
      webhook_id: z.string().describe("The webhook ID to update"),
      endpoint: z.string().url().optional().describe("New endpoint URL"),
      events: z.array(z.enum(WEBHOOK_EVENTS)).optional().describe("New event subscriptions"),
      status: z.enum(["active", "inactive"]).optional().describe("Enable or disable the webhook"),
    },
    async ({ webhook_id, endpoint, events, status }) => {
      const result = await client.updateWebhook(webhook_id, {
        endpoint,
        events: events as string[] | undefined,
        status,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Webhook ──────────────────────────────────────
  server.tool(
    "clickup_delete_webhook",
    "Delete a webhook from ClickUp (irreversible)",
    {
      webhook_id: z.string().describe("The webhook ID to delete"),
    },
    async ({ webhook_id }) => {
      await client.deleteWebhook(webhook_id);
      return {
        content: [{ type: "text", text: `Webhook '${webhook_id}' deleted successfully.` }],
      };
    }
  );
}
