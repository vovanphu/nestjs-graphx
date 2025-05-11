import { CrudResolverFactory } from '.';
import { findCrudProxyProvider } from '../services';
import { ClassType, CrudQueryInterface } from '../types';

export type GraphqlCrudResolverOptions = {
  providers?: any[];
};

export function GraphqlCrudResolverFactory<Entity, Dto>(
  EntityClass: ClassType<Entity>,
  DtoClass: ClassType<Dto>,
  options?: GraphqlCrudResolverOptions,
): ClassType<any> {
  const { providers } = options || {};

  const provider: CrudQueryInterface<Entity, Dto> = findCrudProxyProvider(
    providers,
    EntityClass,
  );

  const CrudResolverExtended = CrudResolverFactory(
    EntityClass,
    DtoClass,
    provider,
  );

  // const OneManyRelationsExtended = OneManyRelationsFactory(
  //   EntityClass,
  //   providers,
  // );

  return CrudResolverExtended();
}
