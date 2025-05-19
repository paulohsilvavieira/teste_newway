import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './task.controller';
import { UtilsModule } from '@/utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
