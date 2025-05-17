import { GraphqlCrudResolverFactory } from '@app/crud';
import { Cat } from '@app/entities';
import { Resolver } from '@nestjs/graphql';
import { CatService } from './cat.service';

@Resolver(Cat)
export class CatResolver extends GraphqlCrudResolverFactory(Cat, {
  providers: [CatService],
}) {}
