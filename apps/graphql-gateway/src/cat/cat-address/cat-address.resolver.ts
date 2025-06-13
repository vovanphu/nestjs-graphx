import { CatAddress } from '@app/entities';
import { GraphqlCrudResolverFactory } from '@app/graphx';
import { Resolver } from '@nestjs/graphql';
import { CatAddressService } from './cat-address.service';

@Resolver(CatAddress)
export class CatAddressResolver extends GraphqlCrudResolverFactory(CatAddress, {
  providers: [CatAddressService],
}) {}
