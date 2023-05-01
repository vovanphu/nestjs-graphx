import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  Class,
  CreateType,
  CrudFindOptions,
  CrudManyResult,
  CrudOneResult,
  CrudQueryService,
  IdentifyType,
  UpdateType,
} from './types';

export function createClientCrudService<Entity, Dto>(
  EntityClass: Class<Entity>,
): Class<any> {
  const entityName = EntityClass.name;

  @Injectable()
  class ClientCrudService implements CrudQueryService<Entity, Dto> {
    constructor(readonly client: ClientProxy) {}

    async createOne(record: CreateType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `createOne${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async findOne(record: IdentifyType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `findOne${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async findMany(
      options: CrudFindOptions<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      const result$ = this.client.send<Promise<CrudManyResult<Entity>>>(
        { cmd: `findMany${entityName}` },
        { options },
      );
      return lastValueFrom(result$);
    }

    async updateOne(record: UpdateType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `updateOne${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async softDeleteOne(
      record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `softDeleteOne${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async restoreOne(
      record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `restoreOne${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }

    async deleteOne(record: IdentifyType<Dto>): Promise<CrudOneResult<Entity>> {
      const result$ = this.client.send<CrudOneResult<Entity>>(
        { cmd: `deleteOne${entityName}` },
        { record },
      );
      return lastValueFrom(result$);
    }
  }

  return ClientCrudService;
}

export function ClientCrudService<Entity, Dto extends Entity>(
  EntityClass: Class<Entity>,
): Class<any> {
  return createClientCrudService<Entity, Dto>(EntityClass);
}
