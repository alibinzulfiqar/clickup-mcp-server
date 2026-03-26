// ClickUp Time Tracking Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

export function registerTimeTrackingTools(server: McpServer, client: ClickUpClient) {
  // ── Get Time Entries ────────────────────────────────────
  server.tool(
    "clickup_get_time_entries",
    "Get time tracking entries for a team within a date range",
    {
      team_id: z.string().describe("The workspace/team ID"),
      start_date: z.number().optional().describe("Start date (Unix ms) — defaults to beginning of current week"),
      end_date: z.number().optional().describe("End date (Unix ms) — defaults to now"),
      assignee: z.array(z.number()).optional().describe("Filter by user IDs"),
    },
    async ({ team_id, start_date, end_date, assignee }) => {
      const result = await client.getTimeEntries(team_id, { start_date, end_date, assignee });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Get Running Time Entry ──────────────────────────────
  server.tool(
    "clickup_get_running_timer",
    "Check if there's a currently running time tracker for the user",
    {
      team_id: z.string().describe("The workspace/team ID"),
    },
    async ({ team_id }) => {
      const result = await client.getRunningTimeEntry(team_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Start Time Entry ────────────────────────────────────
  server.tool(
    "clickup_start_timer",
    "Start a time tracker on a ClickUp task",
    {
      team_id: z.string().describe("The workspace/team ID"),
      task_id: z.string().describe("The task ID to track time for"),
      description: z.string().optional().describe("Description of what you're working on"),
      billable: z.boolean().optional().describe("Mark this time as billable"),
    },
    async ({ team_id, task_id, description, billable }) => {
      const result = await client.startTimeEntry(team_id, task_id, description, billable);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Stop Time Entry ─────────────────────────────────────
  server.tool(
    "clickup_stop_timer",
    "Stop the currently running time tracker",
    {
      team_id: z.string().describe("The workspace/team ID"),
    },
    async ({ team_id }) => {
      const result = await client.stopTimeEntry(team_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Manual Time Entry ────────────────────────────
  server.tool(
    "clickup_log_time",
    "Manually log a time entry for a task (retroactive time tracking)",
    {
      team_id: z.string().describe("The workspace/team ID"),
      task_id: z.string().describe("The task ID"),
      start: z.number().describe("Start time (Unix ms)"),
      duration: z.number().describe("Duration in milliseconds"),
      description: z.string().optional().describe("Description of the work done"),
      billable: z.boolean().optional().describe("Mark as billable time"),
    },
    async ({ team_id, task_id, start, duration, description, billable }) => {
      const result = await client.createTimeEntry(team_id, {
        tid: task_id,
        start,
        duration,
        description,
        billable,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Time Entry ───────────────────────────────────
  server.tool(
    "clickup_delete_time_entry",
    "Delete a time tracking entry (irreversible)",
    {
      team_id: z.string().describe("The workspace/team ID"),
      timer_id: z.string().describe("The time entry ID to delete"),
    },
    async ({ team_id, timer_id }) => {
      await client.deleteTimeEntry(team_id, timer_id);
      return {
        content: [{ type: "text", text: `Time entry '${timer_id}' deleted successfully.` }],
      };
    }
  );
}
