import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
} from 'typeorm';
import { ColumnNumericTransformer } from '../utils/transform-number';
import { TaskEntity } from './TaskEntity';
import { UserRole } from '../utils/user.role';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  tokenRecoverPassword?: string;

  @Column({
    nullable: true,
    type: 'bigint',
    transformer: new ColumnNumericTransformer(),
  })
  expirationTimeTokenRecover?: number;

  @Column({ nullable: true })
  lastAccessAt?: Date;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
