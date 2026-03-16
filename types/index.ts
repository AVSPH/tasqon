export type Priority = "urgent" | "high" | "medium" | "low";
export type ColumnId = string;

export interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
  initials: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: Member;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  assignees: Member[];
  dueDate: string | null;
  priority: Priority;
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  tags: string[];
  coverColor?: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
  limit?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: Member[];
  columns: Column[];
  tasks: Task[];
  color: string;
}

export interface Activity {
  id: string;
  user: Member;
  action: string;
  target: string;
  time: string;
}
