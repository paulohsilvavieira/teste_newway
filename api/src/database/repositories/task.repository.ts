import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities';
import { title } from 'process';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async createTask(params: {
    title: string;
    description: string;
    userId: number;
  }): Promise<void> {
    await this.taskRepository.insert({
      ...params,
      user: { id: params.userId },
    });
  }

  async findTasksByUser(userId: number) {
    return this.taskRepository.find({
      where: { user: { id: userId } },
      select: {
        uuid: true,
        title: true,
        description: true,
        isCompleted: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllTasks() {
    return this.taskRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async markAsCompleted(taskId: string, userId: number) {
    await this.taskRepository.update(
      {
        uuid: taskId,
        user: {
          id: userId,
        },
      },
      { isCompleted: true },
    );
  }
  async markAsIncompleted(taskId: string, userId: number) {
    await this.taskRepository.update(
      {
        uuid: taskId,
        user: {
          id: userId,
        },
      },
      { isCompleted: false },
    );
  }

  async update(
    taskId: string,
    userId: number,
    params: {
      title: string;
      description: string;
    },
  ) {
    await this.taskRepository.update(
      {
        uuid: taskId,
        user: {
          id: userId,
        },
      },
      { title: params.title, description: params.description },
    );
  }

  async deleteTask(taskId: string, userId: number) {
    await this.taskRepository.delete({
      uuid: taskId,
      user: {
        id: userId,
      },
    });
  }
}
