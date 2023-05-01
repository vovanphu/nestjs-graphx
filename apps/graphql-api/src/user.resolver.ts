import { GraphqlCrudResolver } from '@app/crud';
import { UserDto, UserEntity } from '@app/entities';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver(UserEntity)
export class UserResolver extends GraphqlCrudResolver(UserEntity, UserDto) {
  constructor(readonly service: UserService) {
    super(service);
  }
}
