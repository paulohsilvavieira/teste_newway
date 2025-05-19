/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';

import { TaskService } from './services/task.service';
import { AdminJwtAuthGuard } from '@/user/guards/admin-jwt.guard';
import { AuthJWTSwaggerDoc } from '@/user/decorators/auth-swagger.decorator';
import { UserJwtAuthGuard } from '@/user/guards/user-jwt.guard';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/udapte-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(UserJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async create(
    @Body()
    body: CreateTaskDTO,
  ) {
    await this.taskService.createTask({
      title: body.title,
      description: body.description,
      userId: body.user.id,
    });
    return { message: 'Task created successfully' };
  }

  @Get('/my')
  @UseGuards(UserJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async findMyTasks(@Req() req) {
    const user = req.body.user;
    const tasks = await this.taskService.findTasksByUser(user.id);
    return tasks;
  }

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async findAll(@Req() req) {
    const user = req.body.user;
    return this.taskService.findAll(user.role);
  }

  @Put(':id')
  @UseGuards(UserJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async updateTask(@Param('id') id: string, @Body() body: UpdateTaskDTO) {
    await this.taskService.update(id, body.user.id, body);
    return { message: 'Task marked as completed' };
  }

  @Delete(':id')
  @UseGuards(UserJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async deleteTask(@Param('id') id: string, @Body() body) {
    await this.taskService.deleteTask(id, body.user.id);
    return { message: 'Task deleted successfully' };
  }

  @Patch(':id/complete')
  @UseGuards(UserJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async completeTask(@Param('id') id: string, @Req() req) {
    const user = req.body.user;
    await this.taskService.markAsCompleted(id, user.id);
    return { message: 'Task marked as completed' };
  }

  @Patch(':id/incomplete')
  @UseGuards(UserJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  async incompleteTask(@Param('id') id: string, @Req() req) {
    const user = req.body.user;
    await this.taskService.markAsIncompleted(id, user.id);
    return { message: 'Task marked as incompleted' };
  }
}
