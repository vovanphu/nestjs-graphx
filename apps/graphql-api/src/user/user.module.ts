import { Module } from '@nestjs/common';
import { TaskService } from '../task/task.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserService, TaskService, UserResolver],
  exports: [],
})
export class UserModule {}
