import { Inject } from '@nestjs/common';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { toFindManyOptionsDto, toManyResultDto } from '../dtos';
import {
  ONE_MANY_RELATION_WATERMARK,
  OneManyRelationOptions,
} from '../relation';
import { findCrudProxyProvider } from '../services';
import {
  ClassConstructor,
  CrudFindManyOptions,
  CrudManyResult,
  CrudQueryInterface,
} from '../types';

export function OneManyRelationFactory<Entity, RelatedEntity>(
  EntityClass: Entity,
  relation: OneManyRelationOptions<RelatedEntity>,
  provider: CrudQueryInterface<RelatedEntity>,
) {
  return (
    BaseClass: ClassConstructor<any> = class {},
  ): ClassConstructor<any> => {
    const { RelatedEntityClass, relationName } = relation;
    const FindOptions = toFindManyOptionsDto(RelatedEntityClass);
    const RelatedManyResult = toManyResultDto(RelatedEntityClass);
    const relationService = Symbol('relationName');

    @Resolver(EntityClass)
    class OneManyRelation extends BaseClass {
      @Inject(provider)
      readonly [relationService]: CrudQueryInterface<RelatedEntity>;

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
  return (
    BaseClass: ClassConstructor<any> = class {},
  ): ClassConstructor<any> => {
    const relations: OneManyRelationOptions<any>[] =
      Reflect.getMetadata(ONE_MANY_RELATION_WATERMARK, EntityClass) || [];
    return relations.reduce(
      <RelatedEntity>(
        Extended: ClassConstructor<any>,
        relation: OneManyRelationOptions<RelatedEntity>,
      ) => {
        const { RelatedEntityClass } = relation;
        const provider: CrudQueryInterface<RelatedEntity> =
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
