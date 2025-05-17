import { CrudResolverFactory } from '.';
import { findCrudProxyProvider } from '../services';
import { ClassConstructor, CrudQueryInterface } from '../types';

export type GraphqlCrudResolverOptions = {
  providers?: any[];
};

export function GraphqlCrudResolverFactory<Entity>(
  EntityClass: ClassConstructor<Entity>,
  options?: GraphqlCrudResolverOptions,
): ClassConstructor<any> {
  const { providers } = options || {};

  const provider: CrudQueryInterface<Entity> = findCrudProxyProvider(
    providers,
    EntityClass,
  );

  const CrudResolverExtended = CrudResolverFactory(EntityClass, provider);

  // const OneManyRelationsExtended = OneManyRelationsFactory(
  //   EntityClass,
  //   providers,
  // );

  return CrudResolverExtended();
}
