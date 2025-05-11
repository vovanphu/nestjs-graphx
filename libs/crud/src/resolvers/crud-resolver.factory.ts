import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  toCreateDto,
  toCrudFindManyOptions,
  toCrudManyResult,
  toCrudOneResult,
  toFindDto,
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
    const FindDto = toFindDto(EntityClass);
    const IdentifyDto = toIdentifyDto(EntityClass);
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
        record: CrudCreateType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].create(record);
      }

      @Query(() => OneResult, {
        name: `find${entityName}`,
      })
      async find(
        @Args(`find${entityName}Record`, { type: () => FindDto })
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
        record: CrudUpdateType<Dto>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].update(record);
      }

      @Mutation(() => OneResult, {
        name: `softDelete${entityName}`,
        nullable: true,
      })
      async softDelete(
        @Args(`softDelete${entityName}Record`, { type: () => FindDto })
        record: IdentifyType<Entity>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].softDelete(record);
      }

      @Mutation(() => OneResult, {
        name: `restore${entityName}`,
        nullable: true,
      })
      async restore(
        @Args(`restore${entityName}Record`, { type: () => FindDto })
        record: IdentifyType<Entity>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].restore(record);
      }

      @Mutation(() => OneResult, {
        name: `delete${entityName}`,
        nullable: true,
      })
      async delete(
        @Args(`delete${entityName}Record`, { type: () => FindDto })
        record: IdentifyType<Entity>,
      ): Promise<CrudOneResult<Entity>> {
        return this[entityService].delete(record);
      }
    }

    return CrudResolver;
  };
}
