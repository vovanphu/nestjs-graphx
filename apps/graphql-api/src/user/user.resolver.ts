import { GraphqlCrudResolverFactory } from '@app/crud';
import { User, UserDto } from '@app/entities';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver extends GraphqlCrudResolverFactory(User, UserDto, {
  providers: [UserService],
}) {}
