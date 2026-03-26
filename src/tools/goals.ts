// ClickUp Goals & Key Results Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

export function registerGoalTools(server: McpServer, client: ClickUpClient) {
  // ── Get Goals ───────────────────────────────────────────
  server.tool(
    "clickup_get_goals",
    "List all goals in a ClickUp workspace",
    {
      team_id: z.string().describe("The workspace/team ID"),
      include_completed: z.boolean().optional().describe("Include completed goals"),
    },
    async ({ team_id, include_completed }) => {
      const result = await client.getGoals(team_id, include_completed);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Get Goal Detail ─────────────────────────────────────
  server.tool(
    "clickup_get_goal",
    "Get detailed information about a specific ClickUp goal, including key results",
    {
      goal_id: z.string().describe("The goal ID"),
    },
    async ({ goal_id }) => {
      const result = await client.getGoal(goal_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Goal ─────────────────────────────────────────
  server.tool(
    "clickup_create_goal",
    "Create a new goal in a ClickUp workspace with optional key results",
    {
      team_id: z.string().describe("The workspace/team ID"),
      name: z.string().describe("Goal name"),
      due_date: z.number().describe("Due date (Unix ms)"),
      description: z.string().optional().describe("Goal description"),
      multiple_owners: z.boolean().optional().describe("Allow multiple owners"),
      owners: z.array(z.number()).optional().describe("Array of user IDs who own this goal"),
      color: z.string().optional().describe("Goal color hex (e.g. '#00ff00')"),
    },
    async ({ team_id, ...goalData }) => {
      const result = await client.createGoal(team_id, goalData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Update Goal ─────────────────────────────────────────
  server.tool(
    "clickup_update_goal",
    "Update an existing ClickUp goal",
    {
      goal_id: z.string().describe("The goal ID to update"),
      name: z.string().optional().describe("New goal name"),
      due_date: z.number().optional().describe("New due date (Unix ms)"),
      description: z.string().optional().describe("New description"),
      color: z.string().optional().describe("New color hex"),
      add_owners: z.array(z.number()).optional().describe("User IDs to add as owners"),
      rem_owners: z.array(z.number()).optional().describe("User IDs to remove from owners"),
    },
    async ({ goal_id, ...updates }) => {
      const result = await client.updateGoal(goal_id, updates);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Goal ─────────────────────────────────────────
  server.tool(
    "clickup_delete_goal",
    "Delete a ClickUp goal (irreversible)",
    {
      goal_id: z.string().describe("The goal ID to delete"),
    },
    async ({ goal_id }) => {
      await client.deleteGoal(goal_id);
      return {
        content: [{ type: "text", text: `Goal '${goal_id}' deleted successfully.` }],
      };
    }
  );

  // ── Create Key Result ───────────────────────────────────
  server.tool(
    "clickup_create_key_result",
    "Add a key result (target) to a ClickUp goal. Types: number, currency, boolean, percentage, automatic",
    {
      goal_id: z.string().describe("The goal ID to add the key result to"),
      name: z.string().describe("Key result name"),
      type: z.enum(["number", "currency", "boolean", "percentage", "automatic"]).describe("Key result type"),
      steps_start: z.number().optional().describe("Starting value (for number/currency/percentage types)"),
      steps_end: z.number().optional().describe("Target value (for number/currency/percentage types)"),
      unit: z.string().optional().describe("Unit label (e.g. 'USD', 'users', 'points')"),
      owners: z.array(z.number()).optional().describe("User IDs who own this key result"),
      task_ids: z.array(z.string()).optional().describe("Task IDs to link (for 'automatic' type)"),
      list_ids: z.array(z.string()).optional().describe("List IDs to link (for 'automatic' type)"),
    },
    async ({ goal_id, ...krData }) => {
      const result = await client.createKeyResult(goal_id, krData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Update Key Result ───────────────────────────────────
  server.tool(
    "clickup_update_key_result",
    "Update a key result — change progress, name, or targets",
    {
      key_result_id: z.string().describe("The key result ID"),
      steps_current: z.number().optional().describe("Current progress value"),
      name: z.string().optional().describe("New name"),
      note: z.string().optional().describe("Progress note"),
    },
    async ({ key_result_id, ...updates }) => {
      const result = await client.updateKeyResult(key_result_id, updates);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Key Result ───────────────────────────────────
  server.tool(
    "clickup_delete_key_result",
    "Delete a key result from a goal (irreversible)",
    {
      key_result_id: z.string().describe("The key result ID to delete"),
    },
    async ({ key_result_id }) => {
      await client.deleteKeyResult(key_result_id);
      return {
        content: [{ type: "text", text: `Key result '${key_result_id}' deleted successfully.` }],
      };
    }
  );
}
