import api from '@/lib/api';

export interface Task {
  uuid: string;
  title: string;
  description: string;
}

export async function getMyTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks/my');
  return response.data;
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const response = await api.post<Task>('/tasks', task);
  return response.data;
}

export async function updateTask(
  id: string,
  task: Partial<Task>
): Promise<Task> {
  const response = await api.put<Task>(`/tasks/${id}`, task);
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
