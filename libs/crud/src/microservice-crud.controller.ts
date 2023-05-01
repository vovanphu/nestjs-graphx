import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

export function createMicroserviceCrudController<Entity, Dto>(
  EntityClass: Class<Entity>,
): Class<any> {
  const entityName = EntityClass.name;

  @Controller()
  class MicroserviceCrudController implements CrudQueryService<Entity, Dto> {
    constructor(readonly service: CrudQueryService<Entity, Dto>) {}

    @MessagePattern({ cmd: `createOne${entityName}` })
    async createOne(
      @Payload('record') record: CreateType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.createOne(record);
    }

    @MessagePattern({ cmd: `findOne${entityName}` })
    async findOne(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.findOne(record);
    }

    @MessagePattern({ cmd: `findMany${entityName}` })
    async findMany(
      @Payload('options') options: CrudFindOptions<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      return this.service.findMany(options);
    }

    @MessagePattern({ cmd: `updateOne${entityName}` })
    async updateOne(
      @Payload('record') record: UpdateType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.updateOne(record);
    }

    @MessagePattern({ cmd: `softDeleteOne${entityName}` })
    async softDeleteOne(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.softDeleteOne(record);
    }

    @MessagePattern({ cmd: `restoreOne${entityName}` })
    async restoreOne(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.restoreOne(record);
    }

    @MessagePattern({ cmd: `deleteOne${entityName}` })
    async deleteOne(
      @Payload('record') record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.deleteOne(record);
    }
  }

  return MicroserviceCrudController;
}

export function MicroserviceCrudController<Entity, Dto extends Entity>(
  EntityClass: Class<Entity>,
): Class<any> {
  return createMicroserviceCrudController<Entity, Dto>(EntityClass);
}
