/*
Author: Phu Vo (vovanphu1012@gmail.com)
create-find-relation-dataloader-handler.ts (c) 2025
*/

import DataLoader from 'dataloader';
import { AutoRelationMetadata } from '../decorators';
import { toManyResultDto } from '../dtos';
import {
  ClassType,
  CrudFindManyType,
  CrudManyResult,
  RelationProxyServiceInterface,
} from '../types';

export function createFindRelationDataloaderHandler<
  E extends ClassType<any>,
  R extends ClassType<any>,
>(
  provider: RelationProxyServiceInterface<E>,
  relation: AutoRelationMetadata<E>,
): DataLoader.BatchLoadFn<any, R>;

export function createFindRelationDataloaderHandler<
  E extends ClassType<any>,
  R extends ClassType<any>,
>(
  provider: RelationProxyServiceInterface<E>,
  relation: AutoRelationMetadata<E>,
  options?: CrudFindManyType<R>,
): DataLoader.BatchLoadFn<any, CrudManyResult<R>>;

export function createFindRelationDataloaderHandler<
  E extends ClassType<any>,
  R extends ClassType<any>,
>(
  provider: RelationProxyServiceInterface<E>,
  relation: AutoRelationMetadata<E, R>,
  options?: CrudFindManyType<R>,
): DataLoader.BatchLoadFn<any, R | CrudManyResult<R>> {
  const relationName = relation.name;
  const relationType = relation.type;
  const sourceEntityName = relation.entity().name;

  if (['one-to-one', 'many-to-one'].includes(relationType)) {
    return async (entityIds: string[]) => {
      const result = await provider.findRelation(
        relationName,
        entityIds,
        options,
        sourceEntityName,
      );

      return entityIds.map((id) => {
        return result[id]?.entities?.[0] ?? null;
      });
    };
  } else if (['one-to-many', 'many-to-many'].includes(relationType)) {
    return async (entityIds: string[]) => {
      const result = await provider.findRelation(
        relationName,
        entityIds,
        options,
        sourceEntityName,
      );

      return entityIds.map((id) => {
        if (!result[id]) {
          return new (toManyResultDto(relation.target()))();
        }
        return result[id];
      });
    };
  }

  throw new Error(`Relation ${relationName} is not valid`);
}
