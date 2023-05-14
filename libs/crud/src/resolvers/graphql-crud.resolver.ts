import { CrudResolverFactory, OneManyRelationsFactory } from '.';
import { ClassType, CrudQueryService } from '../types';
import { findEntityProvider } from '../utils/find-entity-provider';

export class BaseResolver {}

export function createGraphqlCrudResolver<Entity, Dto>(
  EntityClass: ClassType<Entity>,
  DtoClass: ClassType<Dto>,
  options?: GraphqlCrudResolverOptions,
): ClassType<any> {
  const { providers } = options || {};

  const provider: CrudQueryService<Entity, Dto> = findEntityProvider(
    providers,
    EntityClass,
  );

  const CrudResolverExtended = CrudResolverFactory(
    EntityClass,
    DtoClass,
    provider,
  );

  const OneManyRelationsExtended = OneManyRelationsFactory(
    EntityClass,
    providers,
  );

  return CrudResolverExtended(OneManyRelationsExtended());
}

export interface GraphqlCrudResolverOptions {
  providers?: any[];
}

export function GraphqlCrudResolver<Entity, Dto>(
  EntityClass: ClassType<Entity>,
  DtoClass: ClassType<Dto>,
  options?: GraphqlCrudResolverOptions,
): ClassType<any> {
  return createGraphqlCrudResolver(EntityClass, DtoClass, options);
}
