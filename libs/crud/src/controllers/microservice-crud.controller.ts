import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ClassType,
  CreateType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudOneResult,
  CrudQueryInterface,
  IdentifyType,
  UpdateType,
} from '../types';

export function microserviceCrudControllerFactory<Entity, Dto>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  const entityName = EntityClass.name;

  @Controller()
  class MicroserviceCrudController implements CrudQueryInterface<Entity, Dto> {
    constructor(readonly service: CrudQueryInterface<Entity, Dto>) {}

    @MessagePattern({ cmd: `create${entityName}` })
    async create(
      @Payload('record') record: CreateType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.create(record);
    }

    @MessagePattern({ cmd: `find${entityName}` })
    async find(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.find(record);
    }

    @MessagePattern({ cmd: `findMany${entityName}` })
    async findMany(
      @Payload('options') options: CrudFindManyOptions<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      return this.service.findMany(options);
    }

    @MessagePattern({ cmd: `update${entityName}` })
    async update(
      @Payload('record') record: UpdateType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.update(record);
    }

    @MessagePattern({ cmd: `softDelete${entityName}` })
    async softDelete(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.softDelete(record);
    }

    @MessagePattern({ cmd: `restore${entityName}` })
    async restore(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.restore(record);
    }

    @MessagePattern({ cmd: `delete${entityName}` })
    async delete(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.delete(record);
    }
  }

  return MicroserviceCrudController;
}

export function MicroserviceCrudControllerFactory<Entity, Dto extends Entity>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  return microserviceCrudControllerFactory<Entity, Dto>(EntityClass);
}
