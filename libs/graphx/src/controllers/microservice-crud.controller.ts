/*
Author: Phu Vo (vovanphu1012@gmail.com)
microservice-crud.controller.ts (c) 2025
*/

import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ClassType,
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudManyResult,
  CrudOneResult,
  CrudQueryInterface,
  CrudUpdateType,
} from '../types';

export function createMicroserviceCrudController<Entity>(
  EntityClass: ClassType<Entity>,
  ProviderClass: ClassType<any>,
  BaseClass: ClassType<any> = class {},
): ClassType<any> {
  const entityName = EntityClass.name;
  const providerToken = Symbol(`${entityName}Service`);

  @Controller()
  class MicroserviceCrudController
    extends BaseClass
    implements CrudQueryInterface<Entity>
  {
    @Inject(ProviderClass)
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
      @Payload('entityId') entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].findById(entityId);
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
      @Payload('entityId') entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].softDelete(entityId);
    }

    @MessagePattern({ cmd: `restore${entityName}` })
    async restore(
      @Payload('entityId') entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].restore(entityId);
    }

    @MessagePattern({ cmd: `delete${entityName}` })
    async delete(
      @Payload('entityId') entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[providerToken].delete(entityId);
    }
  }

  return MicroserviceCrudController;
}
