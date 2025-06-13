import { Cat } from '@app/entities';
import { GraphqlCrudResolverFactory } from '@app/graphx';
import { Resolver } from '@nestjs/graphql';
import { CatAddressService } from './cat-address';
import { CatGroupService } from './cat-group';
import { CatProfileService } from './cat-profile';
import { CatService } from './cat.service';

@Resolver(Cat)
export class CatResolver extends GraphqlCrudResolverFactory(Cat, {
  providers: [
    CatService,
    CatProfileService,
    CatAddressService,
    CatGroupService,
  ],
}) {}
