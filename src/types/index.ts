export type Priority = 'Low' | 'Medium' | 'High';

export type TaskStatusFilter = 'All' | 'Active' | 'Completed';

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  priority?: Priority | null;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  priority?: Priority | null;
  dueDate?: string | null;
}

export interface SetCompletionRequest {
  isCompleted: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
