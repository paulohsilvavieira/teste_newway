import * as taskService from '@/app/services/tasks.service';
import { create } from 'zustand';

export interface Task {
  uuid: string;
  title: string;
  description: string;
}

interface TaskState {
  tasks: Task[];
  myTasks: Task[];
  loadTasks: boolean;
  loadMyTasks: boolean;
  getAllTasks: () => Promise<void>;
  getMyTasks: () => Promise<void>;

  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  myTasks: [],
  loadTasks: true,
  loadMyTasks: true,

  getAllTasks: async () => {
    set({ loadTasks: true });
    const data = await taskService.getTasks();
    set({ tasks: data, loadTasks: false });
  },
  getMyTasks: async () => {
    set({ loadMyTasks: true });

    const data = await taskService.getMyTasks();
    set({ myTasks: data, loadMyTasks: false });
  },
  createTask: async (task) => {
    await taskService.createTask(task);
  },
  updateTask: async (id, task) => {
    await taskService.updateTask(id, task);
  },
  deleteTask: async (id) => {
    await taskService.deleteTask(id);
  },
}));
