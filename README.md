# @dev2production/clickup-mcp-server

> **The most comprehensive ClickUp MCP server** — Manage your entire ClickUp workspace through AI assistants.  
> *Developed by [Dev2Production](https://dev2production.com)*

[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![ClickUp API](https://img.shields.io/badge/ClickUp_API-v2-7B68EE)](https://clickup.com/api)

---

## Why This Exists

**ClickUp has 10M+ users and zero MCP support.** Until now.

This MCP server gives AI assistants (Claude, Cursor, Windsurf, VS Code Copilot) full control over your ClickUp workspace — tasks, spaces, folders, lists, comments, time tracking, goals, and webhooks. All through natural language.

**Built by Dev2Production** to fill the biggest gap in the MCP ecosystem.

---

## Features

| Domain | Tools | What You Can Do |
|--------|-------|------------------|
| **Tasks** | 10 tools | Create, update, delete, search tasks. Manage checklists and tags. |
| **Spaces** | 8 tools | Browse workspaces, create/delete spaces and folders. View tags. |
| **Lists** | 6 tools | Manage lists in folders or folderless. View list members. |
| **Comments** | 5 tools | Add comments to tasks/lists, update, delete, assign. |
| **Time Tracking** | 6 tools | Start/stop timers, log time, view time entries. |
| **Goals** | 8 tools | Create goals with key results (OKRs). Track progress. |
| **Webhooks** | 4 tools | Set up real-time notifications for ClickUp events. |

**47 tools total** — the most complete ClickUp integration for any AI platform.

---

## Quick Start

### 1. Get Your ClickUp API Token

1. Go to [ClickUp Settings → Apps](https://app.clickup.com/settings/apps)
2. Click **Generate** under "API Token"
3. Copy the token

### 2. Install

```bash
npm install @dev2production/clickup-mcp-server
```

Or clone and build locally:

```bash
git clone https://github.com/alibinzulfiqar/clickup-mcp-server.git
cd clickup-mcp-server
npm install
npm run build
```

### 3. Configure Your AI Client

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": ["@dev2production/clickup-mcp-server"],
      "env": {
        "CLICKUP_API_TOKEN": "pk_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

#### VS Code / Cursor / Windsurf

Add to your MCP settings:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "CLICKUP_API_TOKEN": "pk_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

---

## All Tools Reference

### Task Management
| Tool | Description |
|------|-------------|
| `clickup_get_tasks` | Get all tasks from a list (with filters: status, assignee, dates) |
| `clickup_get_task` | Get detailed info about a specific task |
| `clickup_create_task` | Create a new task (name, description, priority, assignees, dates) |
| `clickup_update_task` | Update a task (status, priority, assignees, dates) |
| `clickup_delete_task` | Permanently delete a task |
| `clickup_create_checklist` | Add a checklist to a task |
| `clickup_create_checklist_item` | Add an item to a checklist |
| `clickup_update_checklist_item` | Resolve/unresolve a checklist item |
| `clickup_add_tag` | Add a tag to a task |
| `clickup_remove_tag` | Remove a tag from a task |

### Workspace & Spaces
| Tool | Description |
|------|-------------|
| `clickup_get_workspaces` | List all workspaces you belong to |
| `clickup_get_spaces` | List all spaces in a workspace |
| `clickup_create_space` | Create a new space with feature toggles |
| `clickup_delete_space` | Delete a space and all contents |
| `clickup_get_folders` | List all folders in a space |
| `clickup_create_folder` | Create a new folder |
| `clickup_delete_folder` | Delete a folder and all contents |
| `clickup_get_space_tags` | Get all tags in a space |

### Lists
| Tool | Description |
|------|-------------|
| `clickup_get_lists` | Get all lists in a folder |
| `clickup_get_folderless_lists` | Get lists directly in a space (no folder) |
| `clickup_create_list` | Create a list in a folder |
| `clickup_create_folderless_list` | Create a list directly in a space |
| `clickup_delete_list` | Delete a list and all tasks |
| `clickup_get_list_members` | Get all members of a list |

### Comments
| Tool | Description |
|------|-------------|
| `clickup_get_task_comments` | Get all comments on a task |
| `clickup_add_task_comment` | Post a comment on a task |
| `clickup_add_list_comment` | Post a comment on a list |
| `clickup_update_comment` | Edit or resolve a comment |
| `clickup_delete_comment` | Delete a comment |

### Time Tracking
| Tool | Description |
|------|-------------|
| `clickup_get_time_entries` | Get time entries for a date range |
| `clickup_get_running_timer` | Check current running timer |
| `clickup_start_timer` | Start a time tracker on a task |
| `clickup_stop_timer` | Stop the running timer |
| `clickup_log_time` | Manually log time (retroactive) |
| `clickup_delete_time_entry` | Delete a time entry |

### Goals & Key Results
| Tool | Description |
|------|-------------|
| `clickup_get_goals` | List all goals in a workspace |
| `clickup_get_goal` | Get goal details with key results |
| `clickup_create_goal` | Create a new goal |
| `clickup_update_goal` | Update a goal |
| `clickup_delete_goal` | Delete a goal |
| `clickup_create_key_result` | Add a key result to a goal |
| `clickup_update_key_result` | Update key result progress |
| `clickup_delete_key_result` | Delete a key result |

### Webhooks
| Tool | Description |
|------|-------------|
| `clickup_get_webhooks` | List all webhooks in a workspace |
| `clickup_create_webhook` | Create a webhook for real-time events |
| `clickup_update_webhook` | Update webhook endpoint or events |
| `clickup_delete_webhook` | Delete a webhook |

---

## Example Prompts

Once connected, you can ask your AI assistant things like:

- *"Show me all my ClickUp workspaces"*
- *"Create a task called 'Fix login bug' in my Sprint Backlog list with high priority"*
- *"What tasks are assigned to me that are due this week?"*
- *"Start a timer on the API integration task"*
- *"Add a comment to task #abc123 saying the PR is ready for review"*
- *"Create a goal called Q1 Revenue with a key result target of $50,000"*
- *"Set up a webhook to notify me when tasks are completed in the Engineering space"*
- *"How much time did the team log last week?"*

---

## Architecture

```
src/
├── index.ts              # Server entry point + stdio transport
├── clickup-client.ts     # ClickUp API v2 HTTP client
├── types.ts              # TypeScript type definitions
└── tools/
    ├── tasks.ts          # Task + checklist + tag tools
    ├── spaces.ts         # Workspace, space, folder tools
    ├── lists.ts          # List management tools
    ├── comments.ts       # Comment CRUD tools
    ├── time-tracking.ts  # Timer + time entry tools
    ├── goals.ts          # Goal + key result tools
    └── webhooks.ts       # Webhook management tools
```

Built on:
- **[Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)** — Standard MCP server framework
- **ClickUp API v2** — Full REST API coverage
- **TypeScript 5.7** — Strict mode, full type safety
- **Zod** — Runtime schema validation for all tool inputs

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run directly (for testing)
CLICKUP_API_TOKEN=pk_xxx node dist/index.js
```

---

## Security

- API tokens are passed via environment variables only — never hardcoded
- All inputs are validated with Zod schemas before reaching the ClickUp API
- HTTPS-only communication with ClickUp's API
- No data is stored or cached — all operations are pass-through

---

## License

MIT — see [LICENSE](./LICENSE)

---

## Credits

**Developed by [Dev2Production](https://dev2production.com)** — Bridging the gap between AI and productivity tools.

Built to fill the biggest gap in the MCP ecosystem: giving 10M+ ClickUp users the power of AI-driven project management.

---

*If you find this useful, star the repo and share it with your team. PRs welcome.*
