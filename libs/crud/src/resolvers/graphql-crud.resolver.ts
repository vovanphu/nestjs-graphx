import { CrudResolverFactory, OneManyRelationsFactory } from '.';
import { ClassType } from '../types';

export class BaseResolver {}

export function createGraphqlCrudResolver<Entity, Dto>(
  EntityClass: ClassType<Entity>,
  DtoClass: ClassType<Dto>,
  options?: GraphqlCrudResolverOptions,
): ClassType<any> {
  const { providers } = options || {};

  const CrudResolverExtended = CrudResolverFactory(EntityClass, DtoClass);
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
