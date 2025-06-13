import { CatProfile } from '@app/entities';
import { GraphqlCrudResolverFactory } from '@app/graphx';
import { Resolver } from '@nestjs/graphql';
import { CatProfileService } from './cat-profile.service';

@Resolver(CatProfile)
export class CatProfileResolver extends GraphqlCrudResolverFactory(CatProfile, {
  providers: [CatProfileService],
}) {}
