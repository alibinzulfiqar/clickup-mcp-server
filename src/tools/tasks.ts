// ClickUp Task Management Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

export function registerTaskTools(server: McpServer, client: ClickUpClient) {
  // ── Get Tasks from List ─────────────────────────────────
  server.tool(
    "clickup_get_tasks",
    "Get all tasks from a ClickUp list with optional filters (status, assignee, dates)",
    {
      list_id: z.string().describe("The list ID to fetch tasks from"),
      archived: z.boolean().optional().describe("Include archived tasks"),
      page: z.number().optional().describe("Page number (0-indexed, 100 tasks per page)"),
      order_by: z.enum(["id", "created", "updated", "due_date"]).optional().describe("Field to order by"),
      reverse: z.boolean().optional().describe("Reverse the order"),
      subtasks: z.boolean().optional().describe("Include subtasks"),
      include_closed: z.boolean().optional().describe("Include closed tasks"),
      statuses: z.array(z.string()).optional().describe("Filter by status names (e.g. ['in progress', 'review'])"),
      due_date_gt: z.number().optional().describe("Filter: due date greater than (Unix ms)"),
      due_date_lt: z.number().optional().describe("Filter: due date less than (Unix ms)"),
    },
    async (params) => {
      const result = await client.getTasks(params.list_id, {
        archived: params.archived,
        page: params.page,
        order_by: params.order_by,
        reverse: params.reverse,
        subtasks: params.subtasks,
        include_closed: params.include_closed,
        statuses: params.statuses,
        due_date_gt: params.due_date_gt,
        due_date_lt: params.due_date_lt,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Get Single Task ─────────────────────────────────────
  server.tool(
    "clickup_get_task",
    "Get detailed information about a specific ClickUp task by ID",
    {
      task_id: z.string().describe("The task ID (e.g. 'abc123')"),
      include_subtasks: z.boolean().optional().describe("Include subtask details"),
    },
    async ({ task_id, include_subtasks }) => {
      const result = await client.getTask(task_id, include_subtasks);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Task ─────────────────────────────────────────
  server.tool(
    "clickup_create_task",
    "Create a new task in a ClickUp list. Supports name, description, assignees, priority, dates, and more.",
    {
      list_id: z.string().describe("The list ID to create the task in"),
      name: z.string().describe("Task name / title"),
      description: z.string().optional().describe("Task description (supports markdown)"),
      status: z.string().optional().describe("Task status (must match a status in the list, e.g. 'to do', 'in progress')"),
      priority: z.number().min(1).max(4).optional().describe("Priority: 1=Urgent, 2=High, 3=Normal, 4=Low"),
      assignees: z.array(z.number()).optional().describe("Array of user IDs to assign"),
      tags: z.array(z.string()).optional().describe("Array of tag names"),
      due_date: z.number().optional().describe("Due date as Unix timestamp in milliseconds"),
      start_date: z.number().optional().describe("Start date as Unix timestamp in milliseconds"),
      time_estimate: z.number().optional().describe("Time estimate in milliseconds"),
      notify_all: z.boolean().optional().describe("Notify all assignees"),
      parent: z.string().optional().describe("Parent task ID (to create a subtask)"),
    },
    async ({ list_id, ...taskData }) => {
      const result = await client.createTask(list_id, taskData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Update Task ─────────────────────────────────────────
  server.tool(
    "clickup_update_task",
    "Update an existing ClickUp task — change name, status, priority, assignees, dates, etc.",
    {
      task_id: z.string().describe("The task ID to update"),
      name: z.string().optional().describe("New task name"),
      description: z.string().optional().describe("New description (markdown)"),
      status: z.string().optional().describe("New status (e.g. 'complete', 'in progress')"),
      priority: z.number().min(1).max(4).optional().describe("Priority: 1=Urgent, 2=High, 3=Normal, 4=Low"),
      due_date: z.number().optional().describe("New due date (Unix ms)"),
      start_date: z.number().optional().describe("New start date (Unix ms)"),
      time_estimate: z.number().optional().describe("New time estimate (ms)"),
      archived: z.boolean().optional().describe("Archive or unarchive the task"),
      add_assignees: z.array(z.number()).optional().describe("User IDs to add as assignees"),
      remove_assignees: z.array(z.number()).optional().describe("User IDs to remove from assignees"),
    },
    async ({ task_id, add_assignees, remove_assignees, ...updates }) => {
      const body: Record<string, unknown> = { ...updates };
      if (add_assignees || remove_assignees) {
        body.assignees = {
          ...(add_assignees ? { add: add_assignees } : {}),
          ...(remove_assignees ? { rem: remove_assignees } : {}),
        };
      }
      const result = await client.updateTask(task_id, body);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Task ─────────────────────────────────────────
  server.tool(
    "clickup_delete_task",
    "Permanently delete a ClickUp task (irreversible)",
    {
      task_id: z.string().describe("The task ID to delete"),
    },
    async ({ task_id }) => {
      await client.deleteTask(task_id);
      return {
        content: [{ type: "text", text: `Task '${task_id}' deleted successfully.` }],
      };
    }
  );

  // ── Create Checklist ────────────────────────────────────
  server.tool(
    "clickup_create_checklist",
    "Add a checklist to a ClickUp task",
    {
      task_id: z.string().describe("The task ID to add the checklist to"),
      name: z.string().describe("Name of the checklist"),
    },
    async ({ task_id, name }) => {
      const result = await client.createChecklist(task_id, name);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Checklist Item ───────────────────────────────
  server.tool(
    "clickup_create_checklist_item",
    "Add an item to an existing checklist on a ClickUp task",
    {
      checklist_id: z.string().describe("The checklist ID"),
      name: z.string().describe("Name of the checklist item"),
      assignee: z.number().optional().describe("User ID to assign this item to"),
    },
    async ({ checklist_id, name, assignee }) => {
      const result = await client.createChecklistItem(checklist_id, name, assignee);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Update Checklist Item ───────────────────────────────
  server.tool(
    "clickup_update_checklist_item",
    "Update a checklist item — resolve/unresolve, rename, or reassign",
    {
      checklist_id: z.string().describe("The checklist ID"),
      checklist_item_id: z.string().describe("The checklist item ID"),
      name: z.string().optional().describe("New name"),
      resolved: z.boolean().optional().describe("Mark as resolved (true) or unresolved (false)"),
      assignee: z.number().optional().describe("New assignee user ID (null to unassign)"),
    },
    async ({ checklist_id, checklist_item_id, ...updates }) => {
      const result = await client.updateChecklistItem(checklist_id, checklist_item_id, updates);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Add Tag to Task ─────────────────────────────────────
  server.tool(
    "clickup_add_tag",
    "Add a tag to a ClickUp task",
    {
      task_id: z.string().describe("The task ID"),
      tag_name: z.string().describe("Tag name to add"),
    },
    async ({ task_id, tag_name }) => {
      await client.addTagToTask(task_id, tag_name);
      return {
        content: [{ type: "text", text: `Tag '${tag_name}' added to task '${task_id}'.` }],
      };
    }
  );

  // ── Remove Tag from Task ────────────────────────────────
  server.tool(
    "clickup_remove_tag",
    "Remove a tag from a ClickUp task",
    {
      task_id: z.string().describe("The task ID"),
      tag_name: z.string().describe("Tag name to remove"),
    },
    async ({ task_id, tag_name }) => {
      await client.removeTagFromTask(task_id, tag_name);
      return {
        content: [{ type: "text", text: `Tag '${tag_name}' removed from task '${task_id}'.` }],
      };
    }
  );
}
