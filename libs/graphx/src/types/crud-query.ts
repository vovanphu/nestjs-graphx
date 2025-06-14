/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud-query.ts (c) 2025
*/

import { CrudManyResult, CrudOneResult } from './crud-result';
import {
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudUpdateType,
} from './crud-types';

export interface CrudQueryInterface<ObjectType, InputType = ObjectType> {
  create(record: CrudCreateType<InputType>): Promise<CrudOneResult<ObjectType>>;

  find(record: CrudFindType<ObjectType>): Promise<CrudOneResult<ObjectType>>;

  findById(entityId: string | number): Promise<CrudOneResult<ObjectType>>;

  findMany(
    options: CrudFindManyType<ObjectType>,
  ): Promise<CrudManyResult<ObjectType>>;

  update(record: CrudUpdateType<InputType>): Promise<CrudOneResult<ObjectType>>;

  softDelete?(entityId: string | number): Promise<CrudOneResult<ObjectType>>;

  restore?(entityId: string | number): Promise<CrudOneResult<ObjectType>>;

  delete(entityId: string | number): Promise<CrudOneResult<ObjectType>>;
}

export interface RelationProxyServiceInterface<Entity> {
  setRelation(
    relationName: string,
    entityId: string | number,
    relatedId: string | number | undefined,
    entityName: string,
  ): Promise<CrudOneResult<Entity>>;

  addRelation(
    relationName: string,
    entityId: string | number,
    relatedId: string | number | undefined,
    entityName: string,
  ): Promise<CrudOneResult<Entity>>;

  removeRelation(
    relationName: string,
    entityId: string | number,
    relatedId: string | number,
    entityName: string,
  ): Promise<CrudOneResult<Entity>>;

  findRelation<Related>(
    relationName: string,
    entityIds: string[] | number[],
    options: CrudFindManyType<Related>,
    entityName: string,
  ): Promise<Record<string, CrudManyResult<Related>>>;
}

export type ProxyServiceType<Entity> = CrudQueryInterface<Entity> &
  RelationProxyServiceInterface<Entity>;
