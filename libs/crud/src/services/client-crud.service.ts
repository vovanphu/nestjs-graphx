import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ClassType,
  CreateType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudOneResult,
  CrudQueryService,
  IdentifyType,
  UpdateType,
} from '../types';

export const CRUD_SERVICE_WATERMARK = '__crudService__';

export function CrudService<Entity>(Entity: ClassType<Entity>): ClassDecorator {
  return (target) => {
    const type = Entity;
    Reflect.defineMetadata(
      CRUD_SERVICE_WATERMARK,
      { EntityClass: type },
      target,
    );
    Injectable()(target.prototype);
  };
}

export function createClientCrudService<Entity, Dto>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  const entityName = EntityClass.name;

  @CrudService(EntityClass)
  class ClientCrudService implements CrudQueryService<Entity, Dto> {
    constructor(readonly client: ClientProxy) {}

    async create(record: CreateType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `create${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async find(record: IdentifyType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `find${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async findMany(
      options: CrudFindManyOptions<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      const result$ = this.client.send<Promise<CrudManyResult<Entity>>>(
        { cmd: `findMany${entityName}` },
        { options },
      );
      return lastValueFrom(result$);
    }

    async update(record: UpdateType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `update${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async softDelete(
      record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `softDelete${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async restore(record: IdentifyType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `restore${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async delete(record: IdentifyType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `delete${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }
  }

  return ClientCrudService;
}

export function ClientCrudService<Entity, Dto extends Entity>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  return createClientCrudService<Entity, Dto>(EntityClass);
}
