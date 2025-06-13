import { CatGroup } from '@app/entities';
import { GraphqlCrudResolverFactory } from '@app/graphx';
import { Resolver } from '@nestjs/graphql';
import { CatGroupService } from './cat-group.service';

@Resolver(CatGroup)
export class CatGroupResolver extends GraphqlCrudResolverFactory(CatGroup, {
  providers: [CatGroupService],
}) {}
