import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ClassConstructor,
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudManyResult,
  CrudOneResult,
  CrudQueryInterface,
  CrudUpdateType,
  IdentifyType,
} from '../types';

export const CRUD_PROXY_WATERMARK = Symbol('CRUD_PROXY_WATERMARK');

// # TODO: Pass down proxy token so we can inject it in the service
export function CrudProxy<Entity>(
  EntityClass: ClassConstructor<Entity>,
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CRUD_PROXY_WATERMARK, EntityClass, target);
  };
}

export function findCrudProxyProvider<Entity>(
  providers: CrudQueryInterface<Entity>[],
  EntityClass: ClassConstructor<Entity>,
): CrudQueryInterface<Entity> | null {
  if (!providers || !EntityClass) return null;
  return providers.find((p) => {
    return Reflect.getMetadata(CRUD_PROXY_WATERMARK, p) === EntityClass;
  });
}

export function CrudProxyServiceFactory<Entity>(
  EntityClass: ClassConstructor<Entity>,
): ClassConstructor<any> {
  const entityName = EntityClass.name;

  @CrudProxy(EntityClass)
  @Injectable()
  class ClientCrudService implements CrudQueryInterface<Entity> {
    constructor(readonly client: ClientProxy) {}

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

    async findById(
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `findById${entityName}` },
        { record },
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
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `softDelete${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async restore(
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `restore${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async delete(record: IdentifyType<Entity>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `delete${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }
  }

  return ClientCrudService;
}
