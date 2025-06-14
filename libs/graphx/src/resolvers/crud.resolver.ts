/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud.resolver.ts (c) 2025
*/

import { Inject } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createObjectType,
  toCreateDto,
  toFindManyOptionsDto,
  toFindOneDto,
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
} from '../types';
import { lowerCaseFirstLetter } from '../utils';

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
  const OneResult = toOneResultDto(EntityClass);
  const FindManyOptions = toFindManyOptionsDto(EntityClass);
  const ManyResult = toManyResultDto(EntityClass);
  const entityService = Symbol(entityName);
  const entityNameCamelCase = lowerCaseFirstLetter(entityName);

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
      @Args(`${entityNameCamelCase}Id`, { type: () => ID })
      entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].findById(entityId);
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
      @Args(`${entityNameCamelCase}Id`, { type: () => ID })
      entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].softDelete(entityId);
    }

    @Mutation(() => OneResult, {
      name: `restore${entityName}`,
      nullable: true,
    })
    async restore(
      @Args(`${entityNameCamelCase}Id`, { type: () => ID })
      entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].restore(entityId);
    }

    @Mutation(() => OneResult, {
      name: `delete${entityName}`,
      nullable: true,
    })
    async delete(
      @Args(`${entityNameCamelCase}Id`, { type: () => ID })
      entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      return this[entityService].delete(entityId);
    }
  }

  return CrudResolver;
}
