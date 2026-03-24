export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
  startDate?: string;
  createdAt?: string;  // Make it optional with ?
}

export interface User {
  id: string;
  name: string;
  color: string;
}