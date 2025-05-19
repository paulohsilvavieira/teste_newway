import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IBackup } from 'pg-mem';

import { TaskEntity, UserEntity } from '../entities';
import { TaskRepository } from './task.repository';
import { UserRole } from '../utils/user.role';
import { makeFakeDb } from '@/test/utils/mocks/database';
import { randomUUID } from 'node:crypto';

describe('TaskRepository', () => {
  let sut: TaskRepository;
  let connectionFake: DataSource;
  let backup: IBackup;

  beforeAll(async () => {
    const { db, connection } = await makeFakeDb([TaskEntity, UserEntity]);
    connectionFake = connection;
    backup = db.backup();

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity, TaskEntity]),
      ],
      providers: [TaskRepository],
    })
      .overrideProvider(DataSource)
      .useValue(connectionFake)
      .compile();

    sut = moduleRef.get(TaskRepository);
  });

  beforeEach(async () => {
    backup.restore();

    const userRepo = connectionFake.getRepository(UserEntity);
    await userRepo.insert([
      {
        id: 1,
        uuid: randomUUID(),
        name: 'User One',
        email: 'user1@email.com',
        password: 'hashed-password',
        role: UserRole.USER,
      },
      {
        id: 2,
        name: 'User Two',
        uuid: randomUUID(),

        email: 'user2@email.com',
        password: 'hashed-password',
        role: UserRole.USER,
      },
    ]);
  });

  afterAll(async () => {
    await connectionFake.destroy();
  });

  describe('createTask & findTasksByUser', () => {
    it('should create tasks and retrieve only user-specific tasks ordered by createdAt DESC', async () => {
      await sut.createTask({
        title: 'Title A',
        description: 'Description A',
        userId: 1,
      });

      await sut.createTask({
        title: 'dummy_title',
        description: 'dummy_description',
        userId: 2,
      });

      const tasks = await sut.findTasksByUser(1);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Title A');
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks in descending order of creation', async () => {
      await sut.createTask({
        title: 'Title A',
        description: 'Description A',
        userId: 1,
      });

      await sut.createTask({
        title: 'dummy_title',
        description: 'dummy_description',
        userId: 2,
      });

      const allTasks = await sut.getAllTasks();
      expect(allTasks).toHaveLength(2);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a task as completed', async () => {
      await sut.createTask({
        title: 'Title A',
        description: 'Description A',
        userId: 1,
      });

      const [task] = await sut.findTasksByUser(1);

      await sut.markAsCompleted(task.uuid, 1);

      const updated = await connectionFake
        .getRepository(TaskEntity)
        .findOneBy({ id: task.id });

      expect(updated?.isCompleted).toBe(true);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      await sut.createTask({
        title: 'Title A',
        description: 'Description A',
        userId: 2,
      });

      const [task] = await sut.findTasksByUser(2);

      await sut.deleteTask(task.uuid, 2);

      const remaining = await sut.findTasksByUser(2);
      expect(remaining).toHaveLength(0);
    });
  });
});
