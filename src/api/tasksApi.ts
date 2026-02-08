import client from './client';
import type {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  SetCompletionRequest,
  TaskStatusFilter,
} from '../types';

export async function getTasks(status: TaskStatusFilter = 'All'): Promise<TaskResponse[]> {
  const { data } = await client.get<TaskResponse[]>('/api/tasks', {
    params: { status },
  });
  return data;
}

export async function getTask(id: string): Promise<TaskResponse> {
  const { data } = await client.get<TaskResponse>(`/api/tasks/${id}`);
  return data;
}

export async function createTask(request: CreateTaskRequest): Promise<TaskResponse> {
  const { data } = await client.post<TaskResponse>('/api/tasks', request);
  return data;
}

export async function updateTask(id: string, request: UpdateTaskRequest): Promise<TaskResponse> {
  const { data } = await client.put<TaskResponse>(`/api/tasks/${id}`, request);
  return data;
}

export async function toggleComplete(
  id: string,
  request: SetCompletionRequest
): Promise<TaskResponse> {
  const { data } = await client.patch<TaskResponse>(`/api/tasks/${id}/complete`, request);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await client.delete(`/api/tasks/${id}`);
}
