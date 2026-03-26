// ClickUp API v2 Client
// Developed by Dev2Production (https://dev2production.com)

import type {
  ClickUpConfig,
  CreateTaskInput,
  UpdateTaskInput,
} from "./types.js";

const API_BASE = "https://api.clickup.com/api/v2";

export class ClickUpClient {
  private apiToken: string;

  constructor(config: ClickUpConfig) {
    this.apiToken = config.apiToken;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: this.apiToken,
      "Content-Type": "application/json",
    };
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: this.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`ClickUp API error (${response.status}): ${errorBody}`);
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // ═══════════════════════════════════════════════════════════
  // WORKSPACE / TEAMS
  // ═══════════════════════════════════════════════════════════

  async getWorkspaces() {
    return this.request<{ teams: unknown[] }>("/team");
  }

  // ═══════════════════════════════════════════════════════════
  // SPACES
  // ═══════════════════════════════════════════════════════════

  async getSpaces(teamId: string, archived?: boolean) {
    const q = archived ? "?archived=true" : "";
    return this.request<{ spaces: unknown[] }>(`/team/${teamId}/space${q}`);
  }

  async getSpace(spaceId: string) {
    return this.request(`/space/${spaceId}`);
  }

  async createSpace(teamId: string, body: { name: string; multiple_assignees?: boolean; features?: Record<string, { enabled: boolean }> }) {
    return this.request(`/team/${teamId}/space`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async deleteSpace(spaceId: string) {
    return this.request(`/space/${spaceId}`, { method: "DELETE" });
  }

  // ═══════════════════════════════════════════════════════════
  // FOLDERS
  // ═══════════════════════════════════════════════════════════

  async getFolders(spaceId: string, archived?: boolean) {
    const q = archived ? "?archived=true" : "";
    return this.request<{ folders: unknown[] }>(`/space/${spaceId}/folder${q}`);
  }

  async getFolder(folderId: string) {
    return this.request(`/folder/${folderId}`);
  }

  async createFolder(spaceId: string, body: { name: string }) {
    return this.request(`/space/${spaceId}/folder`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async deleteFolder(folderId: string) {
    return this.request(`/folder/${folderId}`, { method: "DELETE" });
  }

  // ═══════════════════════════════════════════════════════════
  // LISTS
  // ═══════════════════════════════════════════════════════════

  async getLists(folderId: string, archived?: boolean) {
    const q = archived ? "?archived=true" : "";
    return this.request<{ lists: unknown[] }>(`/folder/${folderId}/list${q}`);
  }

  async getFolderlessLists(spaceId: string, archived?: boolean) {
    const q = archived ? "?archived=true" : "";
    return this.request<{ lists: unknown[] }>(`/space/${spaceId}/list${q}`);
  }

  async getList(listId: string) {
    return this.request(`/list/${listId}`);
  }

  async createList(folderId: string, body: { name: string; content?: string; due_date?: number; priority?: number; assignee?: number; status?: string }) {
    return this.request(`/folder/${folderId}/list`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async createFolderlessList(spaceId: string, body: { name: string; content?: string }) {
    return this.request(`/space/${spaceId}/list`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async deleteList(listId: string) {
    return this.request(`/list/${listId}`, { method: "DELETE" });
  }

  // ═══════════════════════════════════════════════════════════
  // TASKS
  // ═══════════════════════════════════════════════════════════

  async getTasks(listId: string, params?: {
    archived?: boolean;
    page?: number;
    order_by?: string;
    reverse?: boolean;
    subtasks?: boolean;
    statuses?: string[];
    include_closed?: boolean;
    assignees?: number[];
    due_date_gt?: number;
    due_date_lt?: number;
    date_created_gt?: number;
    date_created_lt?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.archived) searchParams.set("archived", "true");
      if (params.page !== undefined) searchParams.set("page", String(params.page));
      if (params.order_by) searchParams.set("order_by", params.order_by);
      if (params.reverse) searchParams.set("reverse", "true");
      if (params.subtasks) searchParams.set("subtasks", "true");
      if (params.include_closed) searchParams.set("include_closed", "true");
      if (params.statuses) params.statuses.forEach(s => searchParams.append("statuses[]", s));
      if (params.assignees) params.assignees.forEach(a => searchParams.append("assignees[]", String(a)));
      if (params.due_date_gt) searchParams.set("due_date_gt", String(params.due_date_gt));
      if (params.due_date_lt) searchParams.set("due_date_lt", String(params.due_date_lt));
      if (params.date_created_gt) searchParams.set("date_created_gt", String(params.date_created_gt));
      if (params.date_created_lt) searchParams.set("date_created_lt", String(params.date_created_lt));
    }
    const q = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ tasks: unknown[] }>(`/list/${listId}/task${q}`);
  }

  async getTask(taskId: string, includeSubtasks?: boolean) {
    const q = includeSubtasks ? "?include_subtasks=true" : "";
    return this.request(`/task/${taskId}${q}`);
  }

  async createTask(listId: string, task: CreateTaskInput) {
    return this.request(`/list/${listId}/task`, {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: string, updates: UpdateTaskInput) {
    return this.request(`/task/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/task/${taskId}`, { method: "DELETE" });
  }

  async searchTasks(teamId: string, params: {
    query?: string;
    statuses?: string[];
    assignees?: number[];
    tags?: string[];
    due_date_gt?: number;
    due_date_lt?: number;
    include_closed?: boolean;
    page?: number;
  }) {
    const body: Record<string, unknown> = {};
    if (params.query) body.query = params.query;
    if (params.statuses) body.statuses = params.statuses;
    if (params.assignees) body.assignees = params.assignees;
    if (params.tags) body.tags = params.tags;
    if (params.due_date_gt) body.due_date_gt = params.due_date_gt;
    if (params.due_date_lt) body.due_date_lt = params.due_date_lt;
    if (params.include_closed) body.include_closed = params.include_closed;
    if (params.page !== undefined) body.page = params.page;

    return this.request(`/team/${teamId}/task?page=${params.page ?? 0}`, {
      method: "GET",
    });
  }

  // ═══════════════════════════════════════════════════════════
  // TASK CHECKLISTS
  // ═══════════════════════════════════════════════════════════

  async createChecklist(taskId: string, name: string) {
    return this.request(`/task/${taskId}/checklist`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async deleteChecklist(checklistId: string) {
    return this.request(`/checklist/${checklistId}`, { method: "DELETE" });
  }

  async createChecklistItem(checklistId: string, name: string, assignee?: number) {
    const body: Record<string, unknown> = { name };
    if (assignee !== undefined) body.assignee = assignee;
    return this.request(`/checklist/${checklistId}/checklist_item`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateChecklistItem(checklistId: string, checklistItemId: string, updates: { name?: string; resolved?: boolean; assignee?: number | null }) {
    return this.request(`/checklist/${checklistId}/checklist_item/${checklistItemId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // ═══════════════════════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════════════════════

  async getTaskComments(taskId: string) {
    return this.request<{ comments: unknown[] }>(`/task/${taskId}/comment`);
  }

  async getListComments(listId: string) {
    return this.request<{ comments: unknown[] }>(`/list/${listId}/comment`);
  }

  async addTaskComment(taskId: string, commentText: string, notifyAll?: boolean, assignee?: number) {
    const body: Record<string, unknown> = {
      comment_text: commentText,
      notify_all: notifyAll ?? false,
    };
    if (assignee !== undefined) body.assignee = assignee;
    return this.request(`/task/${taskId}/comment`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async addListComment(listId: string, commentText: string, notifyAll?: boolean) {
    return this.request(`/list/${listId}/comment`, {
      method: "POST",
      body: JSON.stringify({
        comment_text: commentText,
        notify_all: notifyAll ?? false,
      }),
    });
  }

  async updateComment(commentId: string, commentText: string, resolved?: boolean) {
    const body: Record<string, unknown> = { comment_text: commentText };
    if (resolved !== undefined) body.resolved = resolved;
    return this.request(`/comment/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async deleteComment(commentId: string) {
    return this.request(`/comment/${commentId}`, { method: "DELETE" });
  }

  // ═══════════════════════════════════════════════════════════
  // TIME TRACKING
  // ═══════════════════════════════════════════════════════════

  async getTimeEntries(teamId: string, params?: {
    start_date?: number;
    end_date?: number;
    assignee?: number[];
  }) {
    const searchParams = new URLSearchParams();
    if (params?.start_date) searchParams.set("start_date", String(params.start_date));
    if (params?.end_date) searchParams.set("end_date", String(params.end_date));
    if (params?.assignee) params.assignee.forEach(a => searchParams.append("assignee", String(a)));
    const q = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ data: unknown[] }>(`/team/${teamId}/time_entries${q}`);
  }

  async getRunningTimeEntry(teamId: string, assignee?: number) {
    const q = assignee ? `?assignee=${assignee}` : "";
    return this.request(`/team/${teamId}/time_entries/current${q}`);
  }

  async startTimeEntry(teamId: string, taskId: string, description?: string, billable?: boolean) {
    const body: Record<string, unknown> = { tid: taskId };
    if (description) body.description = description;
    if (billable !== undefined) body.billable = billable;
    return this.request(`/team/${teamId}/time_entries/start`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async stopTimeEntry(teamId: string) {
    return this.request(`/team/${teamId}/time_entries/stop`, {
      method: "POST",
    });
  }

  async createTimeEntry(teamId: string, body: {
    tid?: string;
    description?: string;
    start: number;
    duration: number;
    assignee?: number;
    billable?: boolean;
    tags?: Array<{ name: string }>;
  }) {
    return this.request(`/team/${teamId}/time_entries`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async deleteTimeEntry(teamId: string, timerId: string) {
    return this.request(`/team/${teamId}/time_entries/${timerId}`, {
      method: "DELETE",
    });
  }

  // ═══════════════════════════════════════════════════════════
  // GOALS
  // ═══════════════════════════════════════════════════════════

  async getGoals(teamId: string, includeCompleted?: boolean) {
    const q = includeCompleted ? "?include_completed=true" : "";
    return this.request<{ goals: unknown[] }>(`/team/${teamId}/goal${q}`);
  }

  async getGoal(goalId: string) {
    return this.request(`/goal/${goalId}`);
  }

  async createGoal(teamId: string, body: {
    name: string;
    due_date: number;
    description?: string;
    multiple_owners?: boolean;
    owners?: number[];
    color?: string;
  }) {
    return this.request(`/team/${teamId}/goal`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateGoal(goalId: string, updates: {
    name?: string;
    due_date?: number;
    description?: string;
    color?: string;
    add_owners?: number[];
    rem_owners?: number[];
  }) {
    return this.request(`/goal/${goalId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteGoal(goalId: string) {
    return this.request(`/goal/${goalId}`, { method: "DELETE" });
  }

  async createKeyResult(goalId: string, body: {
    name: string;
    owners?: number[];
    type: "number" | "currency" | "boolean" | "percentage" | "automatic";
    steps_start?: number;
    steps_end?: number;
    unit?: string;
    task_ids?: string[];
    list_ids?: string[];
  }) {
    return this.request(`/goal/${goalId}/key_result`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateKeyResult(keyResultId: string, updates: {
    steps_current?: number;
    note?: string;
  }) {
    return this.request(`/key_result/${keyResultId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteKeyResult(keyResultId: string) {
    return this.request(`/key_result/${keyResultId}`, { method: "DELETE" });
  }

  // ═══════════════════════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════════════════════

  async getSpaceTags(spaceId: string) {
    return this.request<{ tags: unknown[] }>(`/space/${spaceId}/tag`);
  }

  async addTagToTask(taskId: string, tagName: string) {
    return this.request(`/task/${taskId}/tag/${encodeURIComponent(tagName)}`, {
      method: "POST",
    });
  }

  async removeTagFromTask(taskId: string, tagName: string) {
    return this.request(`/task/${taskId}/tag/${encodeURIComponent(tagName)}`, {
      method: "DELETE",
    });
  }

  // ═══════════════════════════════════════════════════════════
  // WEBHOOKS
  // ═══════════════════════════════════════════════════════════

  async getWebhooks(teamId: string) {
    return this.request<{ webhooks: unknown[] }>(`/team/${teamId}/webhook`);
  }

  async createWebhook(teamId: string, body: {
    endpoint: string;
    events: string[];
    space_id?: string;
    folder_id?: string;
    list_id?: string;
    task_id?: string;
  }) {
    return this.request(`/team/${teamId}/webhook`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateWebhook(webhookId: string, body: {
    endpoint?: string;
    events?: string[];
    status?: "active" | "inactive";
  }) {
    return this.request(`/webhook/${webhookId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async deleteWebhook(webhookId: string) {
    return this.request(`/webhook/${webhookId}`, { method: "DELETE" });
  }

  // ═══════════════════════════════════════════════════════════
  // MEMBERS
  // ═══════════════════════════════════════════════════════════

  async getListMembers(listId: string) {
    return this.request(`/list/${listId}/member`);
  }

  async getTaskMembers(taskId: string) {
    return this.request(`/task/${taskId}/member`);
  }
}
