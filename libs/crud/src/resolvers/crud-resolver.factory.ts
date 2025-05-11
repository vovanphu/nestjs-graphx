import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ClassType,
  CreateType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudOneResult,
  CrudQueryInterface,
  IdentifyType,
  UpdateType,
  toCreateDto,
  toCrudFindManyOptions,
  toCrudManyResult,
  toCrudOneResult,
  toIdentifyDto,
  toUpdateDto,
} from '../types';

export function CrudResolverFactory<Entity, Dto>(
  EntityClass: ClassType<Entity>,
  DtoClass: ClassType<Dto>,
  provider: CrudQueryInterface<Entity, Dto>,
) {
  return (BaseClass: ClassType<any> = class {}): ClassType<any> => {
    const entityName = EntityClass.name;
    const CreateDto = toCreateDto(DtoClass);
    const UpdateDto = toUpdateDto(DtoClass);
    const IdentityDto = toIdentifyDto(EntityClass);
    const OneResult = toCrudOneResult(EntityClass);
    const FindManyOptions = toCrudFindManyOptions(EntityClass);
    const ManyResult = toCrudManyResult(EntityClass);
    const entityService = Symbol(entityName);

    @Resolver(EntityClass)
    class CrudResolver
      extends BaseClass
      implements CrudQueryInterface<Entity, Dto>
    {
      @Inject(provider) readonly [entityService]: CrudQueryInterface<
        Entity,
        Dto
      >;

      @Mutation(() => OneResult, {
        name: `create${entityName}`,
      })
      async create(
        @Args(`create${entityName}Record`, { type: () => CreateDto })
        record: CreateType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].create(record);
      }

      @Query(() => OneResult, {
        name: `find${entityName}`,
      })
      async find(
        @Args(`find${entityName}Record`, { type: () => IdentityDto })
        record: IdentifyType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].find(record);
      }

      @Query(() => ManyResult, {
        name: `findMany${entityName}`,
      })
      async findMany(
        @Args(`findMany${entityName}Options`, {
          type: () => FindManyOptions,
          nullable: true,
        })
        options?: CrudFindManyOptions<Entity>,
      ): Promise<CrudManyResult<Entity>> {
        return this[entityService].findMany(options);
      }

      @Mutation(() => OneResult, {
        name: `update${entityName}`,
      })
      async update(
        @Args(`update${entityName}Record`, { type: () => UpdateDto })
        record: UpdateType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].update(record);
      }

      @Mutation(() => OneResult, {
        name: `softDelete${entityName}`,
        nullable: true,
      })
      async softDelete(
        @Args(`softDelete${entityName}Record`, { type: () => IdentityDto })
        record: IdentifyType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].softDelete(record);
      }

      @Mutation(() => OneResult, {
        name: `restore${entityName}`,
        nullable: true,
      })
      async restore(
        @Args(`restore${entityName}Record`, { type: () => IdentityDto })
        record: IdentifyType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].restore(record);
      }

      @Mutation(() => OneResult, {
        name: `delete${entityName}`,
        nullable: true,
      })
      async delete(
        @Args(`delete${entityName}Record`, { type: () => IdentityDto })
        record: IdentifyType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].delete(record);
      }
    }

    return CrudResolver;
  };
}
