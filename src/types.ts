// ClickUp API v2 type definitions
// Developed by Dev2Production (https://dev2production.com)

export interface ClickUpConfig {
  apiToken: string;
}

export interface ClickUpResponse<T> {
  [key: string]: unknown;
  data?: T;
}

// ── Workspace / Team ──────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: TeamMember[];
}

export interface TeamMember {
  user: {
    id: number;
    username: string;
    email: string;
    color: string;
    profilePicture: string | null;
    initials: string;
    role: number;
  };
}

// ── Spaces ────────────────────────────────────────────────

export interface Space {
  id: string;
  name: string;
  private: boolean;
  statuses: Status[];
  multiple_assignees: boolean;
  features: Record<string, { enabled: boolean }>;
  archived: boolean;
}

export interface Status {
  id: string;
  status: string;
  type: string;
  orderindex: number;
  color: string;
}

// ── Folders ───────────────────────────────────────────────

export interface Folder {
  id: string;
  name: string;
  orderindex: number;
  override_statuses: boolean;
  hidden: boolean;
  space: { id: string; name: string };
  task_count: string;
  archived: boolean;
  lists: ClickUpList[];
}

// ── Lists ─────────────────────────────────────────────────

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: { status: string; color: string; hide_label: boolean };
  priority: { priority: string; color: string } | null;
  assignee: unknown | null;
  task_count: number | null;
  due_date: string | null;
  start_date: string | null;
  folder: { id: string; name: string; hidden: boolean; access: boolean };
  space: { id: string; name: string; access: boolean };
  archived: boolean;
  override_statuses: boolean | null;
  statuses: Status[];
}

// ── Tasks ─────────────────────────────────────────────────

export interface Task {
  id: string;
  custom_id: string | null;
  name: string;
  text_content: string | null;
  description: string | null;
  status: {
    status: string;
    color: string;
    type: string;
    orderindex: number;
  };
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  date_done: string | null;
  archived: boolean;
  creator: { id: number; username: string; color: string; email: string };
  assignees: Array<{ id: number; username: string; color: string; email: string; initials: string }>;
  watchers: Array<{ id: number; username: string; color: string; email: string; initials: string }>;
  checklists: Checklist[];
  tags: Array<{ name: string; tag_fg: string; tag_bg: string }>;
  parent: string | null;
  priority: { id: string; priority: string; color: string; orderindex: string } | null;
  due_date: string | null;
  start_date: string | null;
  points: number | null;
  time_estimate: number | null;
  time_spent: number | null;
  custom_fields: CustomField[];
  dependencies: unknown[];
  linked_tasks: unknown[];
  team_id: string;
  url: string;
  list: { id: string; name: string; access: boolean };
  project: { id: string; name: string; hidden: boolean; access: boolean };
  folder: { id: string; name: string; hidden: boolean; access: boolean };
  space: { id: string };
  subtasks?: Task[];
}

export interface Checklist {
  id: string;
  task_id: string;
  name: string;
  orderindex: number;
  resolved: number;
  unresolved: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  orderindex: number;
  assignee: unknown | null;
  resolved: boolean;
  parent: string | null;
  date_created: string;
  children: unknown[];
}

export interface CustomField {
  id: string;
  name: string;
  type: string;
  type_config: Record<string, unknown>;
  date_created: string;
  hide_from_guests: boolean;
  value?: unknown;
  required: boolean;
}

// ── Comments ──────────────────────────────────────────────

export interface Comment {
  id: string;
  comment: Array<{ text: string; type?: string }>;
  comment_text: string;
  user: { id: number; username: string; email: string; color: string };
  resolved: boolean;
  assignee: unknown | null;
  assigned_by: unknown | null;
  reactions: unknown[];
  date: string;
}

// ── Time Tracking ─────────────────────────────────────────

export interface TimeEntry {
  id: string;
  task: { id: string; name: string; status: { status: string; color: string } };
  wid: string;
  user: { id: number; username: string; email: string; color: string };
  billable: boolean;
  start: string;
  end: string;
  duration: string;
  description: string;
  tags: Array<{ name: string; tag_bg: string; tag_fg: string }>;
  at: string;
}

export interface RunningTimeEntry {
  id: string;
  task: { id: string; name: string } | null;
  user: { id: number; username: string };
  start: string;
  duration: string;
}

// ── Goals ─────────────────────────────────────────────────

export interface Goal {
  id: string;
  name: string;
  team_id: string;
  date_created: string;
  start_date: string | null;
  due_date: string;
  description: string;
  private: boolean;
  archived: boolean;
  creator: number;
  color: string;
  pretty_id: string;
  multiple_owners: boolean;
  folder_id: string | null;
  members: unknown[];
  owners: Array<{ id: number; username: string; email: string }>;
  key_results: KeyResult[];
  percent_completed: number;
  history: unknown[];
  pretty_url: string;
}

export interface KeyResult {
  id: string;
  goal_id: string;
  name: string;
  creator: number;
  type: string;
  date_created: string;
  goal_pretty_id: string;
  percent_completed: number;
  completed: boolean;
  task_ids: string[];
  owners: Array<{ id: number; username: string; email: string }>;
  last_action: { id: string; date: string; userid: number };
  steps_current: number;
  steps_start: number;
  steps_end: number;
  unit: string;
}

// ── Docs (ClickUp 3.0) ───────────────────────────────────

export interface Doc {
  id: string;
  date_created: string;
  date_updated: string;
  name: string;
  parent: { id: string; type: number } | null;
  creator: number;
  deleted: boolean;
  workspace_id: string;
  type: number;
  content: string;
}

// ── Tags ──────────────────────────────────────────────────

export interface Tag {
  name: string;
  tag_fg: string;
  tag_bg: string;
  creator: number;
}

// ── Webhooks ──────────────────────────────────────────────

export interface Webhook {
  id: string;
  userid: number;
  team_id: string;
  endpoint: string;
  client_id: string;
  events: string[];
  task_id: string | null;
  list_id: string | null;
  folder_id: string | null;
  space_id: string | null;
  health: { status: string; fail_count: number };
  secret: string;
}

// ── Tool input helpers ────────────────────────────────────

export interface CreateTaskInput {
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: number;
  due_date?: number;
  start_date?: number;
  time_estimate?: number;
  notify_all?: boolean;
  parent?: string;
  links_to?: string;
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
  assignees?: { add?: number[]; rem?: number[] };
  status?: string;
  priority?: number;
  due_date?: number;
  start_date?: number;
  time_estimate?: number;
  archived?: boolean;
  parent?: string;
}
