/*
Author: Phu Vo (vovanphu1012@gmail.com)
relation.resolver.ts (c) 2025
*/

import { ExecutionContext, Inject } from '@nestjs/common';
import {
  Args,
  Context,
  ID,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  createDataLoaderKey,
  createFindRelationDataloaderHandler,
  resolveDataloader,
} from '../dataloaders';
import { AutoRelationMetadata } from '../decorators';
import {
  createObjectType,
  toFindManyOptionsDto,
  toManyResultDto,
  toOneResultDto,
} from '../dtos';
import { findProxyServiceProvider } from '../services';
import {
  ClassType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudOneResult,
  ProxyServiceType,
  RelationProxyServiceInterface,
} from '../types';
import {
  getAddRelationApiName,
  getRemoveRelationApiName,
  getSetRelationApiName,
  lowerCaseFirstLetter,
} from '../utils';

export function createRelationResolver<Entity extends ClassType<any>>(
  EntityClass: Entity,
  ProviderClass: RelationProxyServiceInterface<Entity>,
  relation: AutoRelationMetadata<any>,
  BaseClass: ClassType<any> = class {},
): ClassType<any> {
  const entityName = EntityClass.name;
  const relationService = Symbol(entityName);
  const relationName = relation.name;
  const RelatedEntityClass = relation.target();
  const sourceEntityName = EntityClass.name;
  const relatedEntityName = RelatedEntityClass.name;
  const sourceNameCamelCase = lowerCaseFirstLetter(sourceEntityName);
  const relatedNameCamelCase = lowerCaseFirstLetter(relatedEntityName);

  const OneResult = toOneResultDto(EntityClass);
  const SourceObjectType = createObjectType(EntityClass);
  const RelatedObjectType = createObjectType(RelatedEntityClass);

  const removeRelationApiName = getRemoveRelationApiName(
    relationName,
    sourceEntityName,
  );
  const setRelationApiName = getSetRelationApiName(
    relationName,
    sourceEntityName,
  );

  const addRelationApiName = getAddRelationApiName(
    relationName,
    sourceEntityName,
  );

  @Resolver(SourceObjectType)
  class RelationResolver extends BaseClass {
    [key: string]: any;

    @Inject(ProviderClass)
    readonly [relationService]: RelationProxyServiceInterface<Entity>;
  }

  if (['one-to-one', 'many-to-one'].includes(relation.type)) {
    @Resolver(SourceObjectType)
    class RelationResolverExtended extends RelationResolver {
      @Mutation(() => OneResult, { name: setRelationApiName })
      async [setRelationApiName](
        @Args(`${sourceNameCamelCase}Id`, { type: () => ID })
        entityId: string | number,
        @Args(`${relatedNameCamelCase}Id`, { type: () => ID, nullable: true })
        relatedId?: string | number,
      ): Promise<CrudOneResult<Entity>> {
        return this[relationService].setRelation(
          relationName,
          entityId,
          relatedId,
          sourceEntityName,
        );
      }

      @ResolveField(() => RelatedObjectType, { nullable: true })
      async [relationName]<Related extends ClassType<any> = any>(
        @Parent() entity: Entity,
        @Context() context: ExecutionContext,
      ): Promise<Related> {
        if (!entity) return null;

        const dataloaderName = createDataLoaderKey(
          relationName,
          sourceEntityName,
        );
        const dataloader = resolveDataloader<string, Related>(
          context,
          dataloaderName,
          createFindRelationDataloaderHandler(this[relationService], relation),
        );

        return await dataloader.load(entity['id']);
      }
    }

    return RelationResolverExtended;
  }

  if (['one-to-many', 'many-to-many'].includes(relation.type)) {
    const ManyRelatedResult = toManyResultDto(RelatedEntityClass);
    const FindManyOptionsDto = toFindManyOptionsDto(RelatedEntityClass);

    @Resolver(SourceObjectType)
    class RelationResolverExtended extends RelationResolver {
      @Mutation(() => OneResult, { name: addRelationApiName })
      async [addRelationApiName](
        @Args(`${sourceNameCamelCase}Id`, { type: () => ID })
        entityId: string | number,
        @Args(`${relatedNameCamelCase}Id`, { type: () => ID })
        relatedId?: string | number,
      ): Promise<CrudOneResult<Entity>> {
        return this[relationService].addRelation(
          relationName,
          entityId,
          relatedId,
          sourceEntityName,
        );
      }

      @Mutation(() => OneResult, { name: removeRelationApiName })
      async [removeRelationApiName](
        @Args(`${sourceNameCamelCase}Id`, { type: () => ID })
        entityId: string | number,
        @Args(`${relatedNameCamelCase}Id`, { type: () => ID })
        relatedId: string | number,
      ): Promise<CrudOneResult<Entity>> {
        return this[relationService].removeRelation(
          relationName,
          entityId,
          relatedId,
          sourceEntityName,
        );
      }

      @ResolveField(() => ManyRelatedResult)
      async [relationName]<Related extends ClassType<any>>(
        @Parent() entity: Entity,
        @Context() context: ExecutionContext,
        @Args('options', { type: () => FindManyOptionsDto, nullable: true })
        options?: CrudFindManyOptions<Related>,
      ): Promise<CrudManyResult<Related>> {
        if (!entity)
          return new (toManyResultDto(RelatedEntityClass as Related))();

        const dataloaderName = createDataLoaderKey(
          relationName,
          sourceEntityName,
          options || {},
        );
        const dataloader = resolveDataloader<string, CrudManyResult<Related>>(
          context,
          dataloaderName,
          createFindRelationDataloaderHandler(
            this[relationService],
            relation,
            options,
          ),
        );

        return await dataloader.load(entity['id']);
      }
    }

    return RelationResolverExtended;
  }

  return RelationResolver;
}

export function createRelationResolvers<Entity>(
  EntityClass: ClassType<Entity>,
  providers: ProxyServiceType<any>[],
  relations: AutoRelationMetadata<any>[],
  BaseClass: ClassType<any> = class {},
): ClassType<any> {
  return relations.reduce(
    (
      Extended: ClassType<any>,
      relation: AutoRelationMetadata<any>,
    ): ClassType<any> => {
      const provider = findProxyServiceProvider(
        providers,
        relation.owner ? relation.entity() : relation.target(),
      );
      return createRelationResolver(EntityClass, provider, relation, Extended);
    },
    BaseClass,
  );
}
