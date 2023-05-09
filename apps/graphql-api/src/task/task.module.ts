import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, UserService, TaskResolver],
  exports: [],
})
export class TaskModule {}
