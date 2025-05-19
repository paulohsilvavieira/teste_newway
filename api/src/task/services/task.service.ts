import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TaskRepository } from '@/database/repositories/task.repository';
import { UserRole } from '@/database/utils/user.role';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(params: {
    title: string;
    description: string;
    userId: number;
  }) {
    return await this.taskRepository.createTask(params);
  }

  async findTasksByUser(userId: number) {
    return await this.taskRepository.findTasksByUser(userId);
  }

  async markAsCompleted(taskId: string, userId: number) {
    await this.taskRepository.markAsCompleted(taskId, userId);
  }

  async markAsIncompleted(taskId: string, userId: number) {
    await this.taskRepository.markAsIncompleted(taskId, userId);
  }

  async update(
    taskId: string,
    userId: number,
    params: {
      title: string;
      description: string;
    },
  ) {
    await this.taskRepository.update(taskId, userId, params);
  }

  async deleteTask(taskId: string, userId: number) {
    await this.taskRepository.deleteTask(taskId, userId);
  }

  async findAll(userRole: UserRole) {
    if (userRole === UserRole.ADMIN) {
      return this.taskRepository.getAllTasks();
    }
    throw new UnauthorizedException();
  }
}
