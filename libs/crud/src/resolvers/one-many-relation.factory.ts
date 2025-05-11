import { Inject } from '@nestjs/common';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
  ONE_MANY_RELATION_WATERMARK,
  OneManyRelationOptions,
} from '../relation';
import { findCrudProxyProvider } from '../services';
import {
  ClassType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudQueryInterface,
  toCrudFindManyOptions,
  toCrudManyResult,
} from '../types';

export function OneManyRelationFactory<Entity, RelatedEntity, RelatedDto>(
  EntityClass: Entity,
  relation: OneManyRelationOptions<RelatedEntity, RelatedDto>,
  provider: CrudQueryInterface<RelatedEntity, RelatedDto>,
) {
  return (BaseClass: ClassType<any> = class {}): ClassType<any> => {
    const { RelatedEntityClass, relationName } = relation;
    const FindOptions = toCrudFindManyOptions(RelatedEntityClass);
    const RelatedManyResult = toCrudManyResult(RelatedEntityClass);
    const relationService = Symbol('relationName');

    @Resolver(EntityClass)
    class OneManyRelation extends BaseClass {
      @Inject(provider) readonly [relationService]: CrudQueryInterface<
        RelatedEntity,
        RelatedDto
      >;

      @ResolveField(() => RelatedManyResult)
      async [relationName](
        @Parent() _parent: Entity,
        @Args(`${relationName}Options`, {
          type: () => FindOptions,
          nullable: true,
        })
        options: CrudFindManyOptions<RelatedEntity>,
      ): Promise<CrudManyResult<RelatedEntity>> {
        return this[relationService].findMany(options);
      }
    }

    return OneManyRelation;
  };
}

export function OneManyRelationsFactory<Entity>(
  EntityClass: Entity,
  providers: any[],
) {
  return (BaseClass: ClassType<any> = class {}): ClassType<any> => {
    const relations: OneManyRelationOptions<any, any>[] =
      Reflect.getMetadata(ONE_MANY_RELATION_WATERMARK, EntityClass) || [];
    return relations.reduce(
      <RelatedEntity, RelatedDto>(
        Extended: ClassType<any>,
        relation: OneManyRelationOptions<RelatedEntity, RelatedDto>,
      ) => {
        const { RelatedEntityClass } = relation;
        const provider: CrudQueryInterface<RelatedEntity, RelatedDto> =
          findCrudProxyProvider(providers, RelatedEntityClass);
        return OneManyRelationFactory(
          EntityClass,
          relation,
          provider,
        )(Extended);
      },
      BaseClass,
    );
  };
}
