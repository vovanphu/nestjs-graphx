import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
  ONE_MANY_RELATION_WATERMARK,
  OneManyRelationOptions,
} from '../relation';
import { CRUD_SERVICE_WATERMARK } from '../services';
import {
  ClassType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudQueryService,
  toCrudFindManyOptions,
  toCrudManyResult,
} from '../types';

export function OneManyRelationFactory<Entity, RelatedEntity, RelatedDto>(
  EntityClass: Entity,
  relation: OneManyRelationOptions<RelatedEntity, RelatedDto>,
  provider: any,
) {
  return (BaseClass: ClassType<any> = class {}): ClassType<any> => {
    const { RelatedEntityClass, relationName } = relation;
    const FindOptions = toCrudFindManyOptions(RelatedEntityClass);
    const RelatedManyResult = toCrudManyResult(RelatedEntityClass);

    @Resolver(EntityClass)
    class OneManyRelation extends BaseClass {
      @Inject(ModuleRef) readonly moduleRef: ModuleRef;

      @ResolveField(() => RelatedManyResult)
      async [relationName](
        @Parent() _parent: Entity,
        @Args(`${relationName}Options`, {
          type: () => FindOptions,
          nullable: true,
        })
        options: CrudFindManyOptions<RelatedEntity>,
      ): Promise<CrudManyResult<RelatedEntity>> {
        const service: CrudQueryService<RelatedEntity, RelatedDto> =
          this.moduleRef.get(provider as any);
        return service.findMany(options);
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
        const provider: CrudQueryService<RelatedEntity, RelatedDto> =
          providers.find((p) => {
            const metadata = Reflect.getMetadata(CRUD_SERVICE_WATERMARK, p);
            return metadata?.EntityClass === RelatedEntityClass;
          });
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
