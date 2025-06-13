/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud.resolver.ts (c) 2025
*/

import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createObjectType,
  toCreateDto,
  toFindManyOptionsDto,
  toFindOneDto,
  toIdentityDto,
  toManyResultDto,
  toOneResultDto,
  toUpdateDto,
} from '../dtos';
import {
  ClassType,
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudManyResult,
  CrudOneResult,
  CrudQueryInterface,
  CrudUpdateType,
  IdentifyType,
} from '../types';

export function createCrudResolver<Entity>(
  EntityClass: ClassType<Entity>,
  provider: CrudQueryInterface<Entity>,
  BaseClass: ClassType<any> = class {},
): ClassType<CrudQueryInterface<Entity>> {
  const entityName = EntityClass.name;
  const EntityObjectType = createObjectType(EntityClass);
  const CreateDto = toCreateDto(EntityClass);
  const UpdateDto = toUpdateDto(EntityClass);
  const FindOneDto = toFindOneDto(EntityClass);
  const IdentifyDto = toIdentityDto(EntityClass);
  const OneResult = toOneResultDto(EntityClass);
  const FindManyOptions = toFindManyOptionsDto(EntityClass);
  const ManyResult = toManyResultDto(EntityClass);
  const entityService = Symbol(entityName);

  @Resolver(EntityObjectType)
  class CrudResolver extends BaseClass implements CrudQueryInterface<Entity> {
    @Inject(provider) readonly [entityService]: CrudQueryInterface<Entity>;

    @Mutation(() => OneResult, {
      name: `create${entityName}`,
    })
    async create(
      @Args(`create${entityName}Record`, { type: () => CreateDto })
      record: CrudCreateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].create(record);
    }

    @Query(() => OneResult, {
      name: `find${entityName}`,
    })
    async find(
      @Args(`find${entityName}Record`, { type: () => FindOneDto })
      record: CrudFindType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].find(record);
    }

    @Query(() => OneResult, {
      name: `find${entityName}ById`,
    })
    async findById(
      @Args(`find${entityName}ByIdRecord`, { type: () => IdentifyDto })
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].findById(record);
    }

    @Query(() => ManyResult, {
      name: `findMany${entityName}`,
    })
    async findMany(
      @Args(`findMany${entityName}Options`, {
        type: () => FindManyOptions,
        nullable: true,
      })
      options?: CrudFindManyType<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      return this[entityService].findMany(options);
    }

    @Mutation(() => OneResult, {
      name: `update${entityName}`,
    })
    async update(
      @Args(`update${entityName}Record`, { type: () => UpdateDto })
      record: CrudUpdateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].update(record);
    }

    @Mutation(() => OneResult, {
      name: `softDelete${entityName}`,
      nullable: true,
    })
    async softDelete(
      @Args(`softDelete${entityName}Record`, { type: () => IdentifyDto })
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].softDelete(record);
    }

    @Mutation(() => OneResult, {
      name: `restore${entityName}`,
      nullable: true,
    })
    async restore(
      @Args(`restore${entityName}Record`, { type: () => IdentifyDto })
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].restore(record);
    }

    @Mutation(() => OneResult, {
      name: `delete${entityName}`,
      nullable: true,
    })
    async delete(
      @Args(`delete${entityName}Record`, { type: () => IdentifyDto })
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].delete(record);
    }
  }

  return CrudResolver;
}
