/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud-proxy.service.ts (c) 2025
*/

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ClassType,
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudManyResult,
  CrudOneResult,
  CrudQueryInterface,
  CrudUpdateType,
  ProxyServiceType,
  RelationProxyServiceInterface,
} from '../types';
import {
  getAddRelationApiName,
  getFindRelationApiName,
  getRemoveRelationApiName,
  getSetRelationApiName,
} from '../utils';

export const PROXY_SERVICE_WATERMARK = Symbol('PROXY_SERVICE_WATERMARK');

export function ProxyService<Entity>(
  EntityClass: ClassType<Entity>,
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(PROXY_SERVICE_WATERMARK, EntityClass, target);
  };
}

export function findProxyServiceProvider<Entity>(
  providers: ProxyServiceType<Entity>[],
  EntityClass: ClassType<Entity>,
): ProxyServiceType<Entity> | null {
  if (!providers || !EntityClass) return null;
  return providers.find((p) => {
    return Reflect.getMetadata(PROXY_SERVICE_WATERMARK, p) === EntityClass;
  });
}

export function CrudProxyServiceFactory<Entity>(
  EntityClass: ClassType<Entity>,
  providerToken: string | symbol,
  BaseClass: ClassType<any> = class {},
): ClassType<any> {
  const entityName = EntityClass.name;

  @ProxyService(EntityClass)
  @Injectable()
  class ClientCrudService
    extends BaseClass
    implements
      CrudQueryInterface<Entity>,
      RelationProxyServiceInterface<Entity>
  {
    @Inject(providerToken) readonly client: ClientProxy;

    async create(
      record: CrudCreateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `create${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async find(record: CrudFindType<Entity>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `find${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async findById(entityId: string | number): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `findById${entityName}` },
        { entityId },
      );
      return lastValueFrom(result$);
    }

    async findMany(
      options: CrudFindManyType<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      const result$ = this.client.send<CrudManyResult<Entity>>(
        { cmd: `findMany${entityName}` },
        { options },
      );
      return lastValueFrom(result$);
    }

    async update(
      record: CrudUpdateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `update${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async softDelete(
      entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `softDelete${entityName}` },
        { entityId },
      );
      return lastValueFrom(result$);
    }

    async restore(entityId: string | number): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `restore${entityName}` },
        { entityId },
      );
      return lastValueFrom(result$);
    }

    async delete(entityId: string | number): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `delete${entityName}` },
        { entityId },
      );
      return lastValueFrom(result$);
    }

    async setRelation(
      relationName: string,
      entityId: string | number,
      relatedId: string | number | undefined,
      entityName: string,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        {
          cmd: getSetRelationApiName(relationName, entityName),
        },
        {
          relationName,
          entityId,
          relatedId,
        },
      );
      return lastValueFrom(result$);
    }

    async addRelation(
      relationName: string,
      entityId: string | number,
      relatedId: string | number,
      entityName: string,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        {
          cmd: getAddRelationApiName(relationName, entityName),
        },
        {
          relationName,
          entityId,
          relatedId,
        },
      );
      return lastValueFrom(result$);
    }

    async removeRelation(
      relationName: string,
      entityId: string | number,
      relatedId: string | number,
      entityName: string,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        {
          cmd: getRemoveRelationApiName(relationName, entityName),
        },
        {
          relationName,
          entityId,
          relatedId,
        },
      );
      return lastValueFrom(result$);
    }

    async findRelation<Related>(
      relationName: string,
      entityIds: string[] | number[],
      options: CrudFindManyType<Related>,
      entityName: string,
    ): Promise<Record<string, CrudManyResult<Related>>> {
      const result$ = this.client.send<Record<string, CrudManyResult<Related>>>(
        {
          cmd: getFindRelationApiName(relationName, entityName),
        },
        {
          relationName,
          entityIds,
          options,
        },
      );
      return lastValueFrom(result$);
    }
  }

  return ClientCrudService;
}
