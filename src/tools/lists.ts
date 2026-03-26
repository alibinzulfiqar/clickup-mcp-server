// ClickUp List Management Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

export function registerListTools(server: McpServer, client: ClickUpClient) {
  // ── Get Lists in Folder ─────────────────────────────────
  server.tool(
    "clickup_get_lists",
    "Get all lists inside a ClickUp folder",
    {
      folder_id: z.string().describe("The folder ID"),
      archived: z.boolean().optional().describe("Include archived lists"),
    },
    async ({ folder_id, archived }) => {
      const result = await client.getLists(folder_id, archived);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Get Folderless Lists ────────────────────────────────
  server.tool(
    "clickup_get_folderless_lists",
    "Get lists that live directly in a space (not inside any folder)",
    {
      space_id: z.string().describe("The space ID"),
      archived: z.boolean().optional().describe("Include archived lists"),
    },
    async ({ space_id, archived }) => {
      const result = await client.getFolderlessLists(space_id, archived);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create List in Folder ───────────────────────────────
  server.tool(
    "clickup_create_list",
    "Create a new list inside a ClickUp folder",
    {
      folder_id: z.string().describe("The folder ID to create the list in"),
      name: z.string().describe("List name"),
      content: z.string().optional().describe("List description"),
      due_date: z.number().optional().describe("Due date (Unix ms)"),
      priority: z.number().min(1).max(4).optional().describe("Priority: 1=Urgent, 2=High, 3=Normal, 4=Low"),
      status: z.string().optional().describe("Initial status for tasks"),
    },
    async ({ folder_id, ...listData }) => {
      const result = await client.createList(folder_id, listData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Folderless List ──────────────────────────────
  server.tool(
    "clickup_create_folderless_list",
    "Create a new list directly in a space (without a folder)",
    {
      space_id: z.string().describe("The space ID to create the list in"),
      name: z.string().describe("List name"),
      content: z.string().optional().describe("List description"),
      due_date: z.number().optional().describe("Due date (Unix ms)"),
      priority: z.number().min(1).max(4).optional().describe("Priority: 1=Urgent, 2=High, 3=Normal, 4=Low"),
      status: z.string().optional().describe("Initial status for tasks"),
    },
    async ({ space_id, ...listData }) => {
      const result = await client.createFolderlessList(space_id, listData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete List ─────────────────────────────────────────
  server.tool(
    "clickup_delete_list",
    "Delete a ClickUp list (irreversible — all tasks inside will be deleted)",
    {
      list_id: z.string().describe("The list ID to delete"),
    },
    async ({ list_id }) => {
      await client.deleteList(list_id);
      return {
        content: [{ type: "text", text: `List '${list_id}' deleted successfully.` }],
      };
    }
  );

  // ── Get List Members ────────────────────────────────────
  server.tool(
    "clickup_get_list_members",
    "Get all members who have access to a ClickUp list",
    {
      list_id: z.string().describe("The list ID"),
    },
    async ({ list_id }) => {
      const result = await client.getListMembers(list_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
