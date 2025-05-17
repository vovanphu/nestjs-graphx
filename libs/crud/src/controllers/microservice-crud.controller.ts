import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

export function MicroserviceCrudControllerFactory<Entity>(
  EntityClass: ClassConstructor<Entity>,
  provider: ClassConstructor<any>,
): ClassConstructor<any> {
  const entityName = EntityClass.name;
  const providerToken = Symbol(`${entityName}Service`);

  @Controller()
  class MicroserviceCrudController implements CrudQueryInterface<Entity> {
    @Inject(provider)
    readonly [providerToken]: CrudQueryInterface<Entity>;

    @MessagePattern({ cmd: `create${entityName}` })
    async create(
      @Payload('record') record: CrudCreateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].create(record);
    }

    @MessagePattern({ cmd: `find${entityName}` })
    async find(
      @Payload('record') record: CrudFindType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].find(record);
    }

    @MessagePattern({ cmd: `findById${entityName}` })
    async findById(
      @Payload('record') record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].find(record);
    }

    @MessagePattern({ cmd: `findMany${entityName}` })
    async findMany(
      @Payload('options') options: CrudFindManyType<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      return this[providerToken].findMany(options);
    }

    @MessagePattern({ cmd: `update${entityName}` })
    async update(
      @Payload('record') record: CrudUpdateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].update(record);
    }

    @MessagePattern({ cmd: `softDelete${entityName}` })
    async softDelete(
      @Payload('record') record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].softDelete(record);
    }

    @MessagePattern({ cmd: `restore${entityName}` })
    async restore(
      @Payload('record') record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].restore(record);
    }

    @MessagePattern({ cmd: `delete${entityName}` })
    async delete(
      @Payload('record') record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].delete(record);
    }
  }

  return MicroserviceCrudController;
}
