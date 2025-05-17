import { GraphqlCrudResolverFactory } from '@app/crud';
import { UserProfile } from '@app/entities';
import { Resolver } from '@nestjs/graphql';
import { UserProfileService } from './user-profile.service';

@Resolver(UserProfile)
export class UserProfileResolver extends GraphqlCrudResolverFactory(
  UserProfile,
  {
    providers: [UserProfileService],
  },
) {}
