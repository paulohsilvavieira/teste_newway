import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { randomUUID } from 'node:crypto';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', {
    default: randomUUID(),
  })
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
