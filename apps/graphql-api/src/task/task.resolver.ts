import { GraphqlCrudResolver } from '@app/crud';
import { Task, TaskDto } from '@app/entities/task.entity';
import { Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver extends GraphqlCrudResolver(Task, TaskDto, {
  providers: [TaskService],
}) {}
