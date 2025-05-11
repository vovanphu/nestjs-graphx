import { GraphqlCrudResolverFactory } from '@app/crud';
import { Task, TaskDto } from '@app/entities/task.entity';
import { Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver extends GraphqlCrudResolverFactory(Task, TaskDto, {
  providers: [TaskService],
}) {}
