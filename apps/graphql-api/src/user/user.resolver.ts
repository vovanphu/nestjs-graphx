import { GraphqlCrudResolverFactory } from '@app/crud';
import { User } from '@app/entities';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver extends GraphqlCrudResolverFactory(User, {
  providers: [UserService],
}) {}
