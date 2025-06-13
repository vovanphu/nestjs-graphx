/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud.resolver.factory.ts (c) 2025
*/

import { createCrudResolver, createRelationResolvers } from '.';
import { getAutoRelations } from '../decorators';
import { findProxyServiceProvider } from '../services';
import { ClassType, ProxyServiceType } from '../types';

export type GraphqlCrudResolverOptions = {
  providers?: any[];
};

export function GraphqlCrudResolverFactory<Entity>(
  EntityClass: ClassType<Entity>,
  options?: GraphqlCrudResolverOptions,
): ClassType<any> {
  const { providers } = options || {};

  const provider: ProxyServiceType<Entity> = findProxyServiceProvider(
    providers,
    EntityClass,
  );

  const CrudResolver = createCrudResolver(EntityClass, provider);

  const autoRelations = getAutoRelations(EntityClass);

  const RelationResolver = createRelationResolvers(
    EntityClass,
    providers,
    autoRelations,
    CrudResolver,
  );

  return RelationResolver;
}
