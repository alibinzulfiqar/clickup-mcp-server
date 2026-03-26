// ClickUp Spaces & Folders Management Tools
// Developed by Dev2Production (https://dev2production.com)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ClickUpClient } from "../clickup-client.js";

export function registerSpaceTools(server: McpServer, client: ClickUpClient) {
  // ── Get Workspaces (Teams) ──────────────────────────────
  server.tool(
    "clickup_get_workspaces",
    "List all ClickUp workspaces (teams) the authenticated user belongs to",
    {},
    async () => {
      const result = await client.getWorkspaces();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Get Spaces ──────────────────────────────────────────
  server.tool(
    "clickup_get_spaces",
    "List all spaces in a ClickUp workspace (team)",
    {
      team_id: z.string().describe("The workspace/team ID"),
      archived: z.boolean().optional().describe("Include archived spaces"),
    },
    async ({ team_id, archived }) => {
      const result = await client.getSpaces(team_id, archived);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Space ────────────────────────────────────────
  server.tool(
    "clickup_create_space",
    "Create a new space in a ClickUp workspace",
    {
      team_id: z.string().describe("The workspace/team ID"),
      name: z.string().describe("Space name"),
      multiple_assignees: z.boolean().optional().describe("Allow multiple assignees on tasks"),
      features: z.object({
        due_dates: z.object({ enabled: z.boolean() }).optional(),
        time_tracking: z.object({ enabled: z.boolean() }).optional(),
        tags: z.object({ enabled: z.boolean() }).optional(),
        time_estimates: z.object({ enabled: z.boolean() }).optional(),
        checklists: z.object({ enabled: z.boolean() }).optional(),
      }).optional().describe("Feature toggles for the space"),
    },
    async ({ team_id, name, multiple_assignees, features }) => {
      const result = await client.createSpace(team_id, {
        name,
        multiple_assignees,
        features,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Space ────────────────────────────────────────
  server.tool(
    "clickup_delete_space",
    "Delete a ClickUp space (irreversible — all folders, lists, and tasks inside will be deleted)",
    {
      space_id: z.string().describe("The space ID to delete"),
    },
    async ({ space_id }) => {
      await client.deleteSpace(space_id);
      return {
        content: [{ type: "text", text: `Space '${space_id}' deleted successfully.` }],
      };
    }
  );

  // ── Get Folders ─────────────────────────────────────────
  server.tool(
    "clickup_get_folders",
    "List all folders in a ClickUp space",
    {
      space_id: z.string().describe("The space ID"),
      archived: z.boolean().optional().describe("Include archived folders"),
    },
    async ({ space_id, archived }) => {
      const result = await client.getFolders(space_id, archived);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Create Folder ───────────────────────────────────────
  server.tool(
    "clickup_create_folder",
    "Create a new folder inside a ClickUp space",
    {
      space_id: z.string().describe("The space ID"),
      name: z.string().describe("Folder name"),
    },
    async ({ space_id, name }) => {
      const result = await client.createFolder(space_id, { name });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Delete Folder ───────────────────────────────────────
  server.tool(
    "clickup_delete_folder",
    "Delete a ClickUp folder (irreversible — all lists and tasks inside will be deleted)",
    {
      folder_id: z.string().describe("The folder ID to delete"),
    },
    async ({ folder_id }) => {
      await client.deleteFolder(folder_id);
      return {
        content: [{ type: "text", text: `Folder '${folder_id}' deleted successfully.` }],
      };
    }
  );

  // ── Get Space Tags ──────────────────────────────────────
  server.tool(
    "clickup_get_space_tags",
    "Get all tags available in a ClickUp space",
    {
      space_id: z.string().describe("The space ID"),
    },
    async ({ space_id }) => {
      const result = await client.getSpaceTags(space_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
