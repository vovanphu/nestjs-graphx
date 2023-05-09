import { GraphqlCrudResolver } from '@app/crud';
import { User, UserDto } from '@app/entities';
import { Resolver } from '@nestjs/graphql';
import { TaskService } from '../task/task.service';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver extends GraphqlCrudResolver(User, UserDto, {
  providers: [TaskService],
}) {
  constructor(readonly service: UserService) {
    super();
  }
}
