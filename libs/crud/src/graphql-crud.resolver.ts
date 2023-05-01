import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Class,
  CreateType,
  CrudFindOptions,
  CrudManyResult,
  CrudOneResult,
  CrudQueryService,
  IdentifyType,
  UpdateType,
  toCreateDto,
  toCrudFindOptions,
  toCrudManyResult,
  toCrudOneResult,
  toIdentifyDto,
  toUpdateDto,
} from './types';

export function createGraphqlCrudResolver<Entity, Dto>(
  EntityClass: Class<Entity>,
  DtoClass: Class<Dto>,
): Class<any> {
  const entityName = EntityClass.name;
  const CreateDto = toCreateDto(DtoClass);
  const UpdateDto = toUpdateDto(DtoClass);
  const IdentityDto = toIdentifyDto(DtoClass);
  const OneResult = toCrudOneResult(EntityClass);
  const ManyResult = toCrudManyResult(EntityClass);
  const FindOptions = toCrudFindOptions();

  @Resolver(EntityClass)
  class GraphqlCrudResolver implements CrudQueryService<Entity, Dto> {
    constructor(readonly service: CrudQueryService<Entity, Dto>) {}

    @Mutation(() => OneResult, {
      name: `createOne${entityName}`,
    })
    async createOne(
      @Args('record', { type: () => CreateDto }) record: CreateType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.createOne(record);
    }

    @Query(() => OneResult, {
      name: `findOne${entityName}`,
    })
    async findOne(
      @Args('record', { type: () => IdentityDto }) record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.findOne(record);
    }

    @Query(() => ManyResult, {
      name: `findMany${entityName}`,
    })
    async findMany(
      @Args('options', {
        type: () => FindOptions,
        nullable: true,
      })
      options: CrudFindOptions<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      return this.service.findMany(options);
    }

    @Mutation(() => OneResult, {
      name: `updateOne${entityName}`,
    })
    async updateOne(
      @Args('record', { type: () => UpdateDto }) record: UpdateType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.updateOne(record);
    }

    @Mutation(() => OneResult, {
      name: `softDeleteOne${entityName}`,
      nullable: true,
    })
    async softDeleteOne(
      @Args('record', { type: () => IdentityDto }) record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.softDeleteOne(record);
    }

    @Mutation(() => OneResult, {
      name: `restoreOne${entityName}`,
      nullable: true,
    })
    async restoreOne(
      @Args('record', { type: () => IdentityDto }) record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.restoreOne(record);
    }

    @Mutation(() => OneResult, {
      name: `deleteOne${entityName}`,
      nullable: true,
    })
    async deleteOne(
      @Args('record', { type: () => IdentityDto }) record: IdentifyType<Dto>,
    ): Promise<CrudOneResult<Entity>> {
      return this.service.deleteOne(record);
    }
  }

  return GraphqlCrudResolver;
}

export function GraphqlCrudResolver<Entity, Dto>(
  EntityClass: Class<Entity>,
  DtoClass: Class<Dto>,
): Class<any> {
  return createGraphqlCrudResolver(EntityClass, DtoClass);
}
