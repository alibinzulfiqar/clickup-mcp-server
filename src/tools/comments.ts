// ClickUp Comment Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

export function registerCommentTools(server: McpServer, client: ClickUpClient) {
  // ── Get Task Comments ───────────────────────────────────
  server.tool(
    "clickup_get_task_comments",
    "Get all comments on a ClickUp task",
    {
      task_id: z.string().describe("The task ID"),
      start: z.number().optional().describe("Start offset for pagination"),
      start_id: z.string().optional().describe("Start from a specific comment ID"),
    },
    async ({ task_id }) => {
      const result = await client.getTaskComments(task_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Add Comment to Task ─────────────────────────────────
  server.tool(
    "clickup_add_task_comment",
    "Post a new comment on a ClickUp task",
    {
      task_id: z.string().describe("The task ID to comment on"),
      comment_text: z.string().describe("The comment text (plain text)"),
      notify_all: z.boolean().optional().describe("Notify all assignees about this comment"),
      assignee: z.number().optional().describe("User ID to assign this comment to (creates an assigned comment)"),
    },
    async ({ task_id, comment_text, notify_all, assignee }) => {
      const result = await client.addTaskComment(task_id, comment_text, notify_all, assignee);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Add Comment to List ─────────────────────────────────
  server.tool(
    "clickup_add_list_comment",
    "Post a new comment on a ClickUp list",
    {
      list_id: z.string().describe("The list ID to comment on"),
      comment_text: z.string().describe("The comment text"),
      notify_all: z.boolean().optional().describe("Notify all members"),
      assignee: z.number().optional().describe("User ID to assign this comment to"),
    },
    async ({ list_id, comment_text, notify_all }) => {
      const result = await client.addListComment(list_id, comment_text, notify_all);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Update Comment ──────────────────────────────────────
  server.tool(
    "clickup_update_comment",
    "Edit an existing comment on ClickUp",
    {
      comment_id: z.string().describe("The comment ID to update"),
      comment_text: z.string().describe("New comment text"),
      assignee: z.number().optional().describe("New assignee user ID"),
      resolved: z.boolean().optional().describe("Mark as resolved or unresolved"),
    },
    async ({ comment_id, comment_text, resolved }) => {
      const result = await client.updateComment(comment_id, comment_text, resolved);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Comment ──────────────────────────────────────
  server.tool(
    "clickup_delete_comment",
    "Delete a comment from ClickUp (irreversible)",
    {
      comment_id: z.string().describe("The comment ID to delete"),
    },
    async ({ comment_id }) => {
      await client.deleteComment(comment_id);
      return {
        content: [{ type: "text", text: `Comment '${comment_id}' deleted successfully.` }],
      };
    }
  );
}
