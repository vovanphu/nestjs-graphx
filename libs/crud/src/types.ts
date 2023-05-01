import {
  Field,
  InputType,
  Int,
  IntersectionType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export type ID = string | number;

export type WithIdType<T> = T & { id: ID };

export type CreateType<Dto> = DeepPartial<Dto>;

export type UpdateType<Dto> = WithIdType<DeepPartial<Dto>>;

export type IdentifyType<Dto> = WithIdType<DeepPartial<Dto>>;

export interface CrudFindOptions<Entity> {
  sort?: CrudSortOptions<Entity>;
  pagination?: CrudPaginationOptions;
}

export interface CrudSortOptions<Entity> {
  field?: keyof Entity | 'updatedAt';
  direction?: 'ASC' | 'DESC';
}

export interface CrudPaginationOptions {
  offset?: CrudOffsetOptions;
}

export interface CrudOffsetOptions {
  page?: number;
  limit?: number;
}

export type CrudManyResult<Dto> = CrudOffsetManyResult<Dto>;

export interface CrudOffsetManyResult<Entity> {
  entities: Entity[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface CrudOneResult<Entity> {
  entity?: Entity;
}

export interface CrudQueryService<Entity, Dto> {
  createOne(record: DeepPartial<Dto>): Promise<CrudOneResult<Entity>>;

  findOne(record: WithIdType<DeepPartial<Dto>>): Promise<CrudOneResult<Entity>>;

  findMany(options: CrudFindOptions<Entity>): Promise<CrudManyResult<Entity>>;

  updateOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>>;

  softDeleteOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>>;

  restoreOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>>;

  deleteOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>>;
}

export function toCreateDto<Dto extends Class<any>>(
  DtoClass: Dto,
): CreateType<Dto> {
  @InputType(`Create${DtoClass.name}`)
  class CreateDto extends OmitType(DtoClass, ['id']) {}
  return CreateDto as CreateType<Dto>;
}

export function toUpdateDto<Dto extends Class<any>>(
  DtoClass: Dto,
): UpdateType<Dto> {
  @InputType(`Update${DtoClass.name}`)
  class UpdateDto extends IntersectionType(
    PickType(DtoClass, ['id']),
    PartialType(DtoClass),
  ) {}
  return UpdateDto as UpdateType<Dto>;
}

export function toIdentifyDto<Dto extends Class<any>>(
  DtoClass: Dto,
): IdentifyType<Dto> {
  @InputType(`Identify${DtoClass.name}`)
  class IdentifyDto extends PickType(DtoClass, ['id']) {}
  return IdentifyDto as IdentifyType<Dto>;
}

export function toCrudManyResult<Entity extends Class<any>>(
  EntityClass: Entity,
): Class<any> {
  @ObjectType()
  class OffsetManyResult implements CrudOffsetManyResult<Entity> {
    @Field(() => [EntityClass])
    entities: Entity[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    pages: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
  }

  return OffsetManyResult;
}

export function toCrudOneResult<Entity>(
  EntityClass: Class<Entity>,
): Class<any> {
  @ObjectType()
  class OneResult implements CrudOneResult<Entity> {
    @Field(() => EntityClass, { nullable: true })
    entity?: Entity;
  }

  return OneResult;
}

export function toCrudFindOptions<Entity extends Class<any>>(): Class<any> {
  @InputType()
  class Sort implements CrudSortOptions<Entity> {
    @Field(() => String, { nullable: true })
    field?: 'updatedAt' | (string & keyof Entity);

    @Field(() => String, { nullable: true })
    direction?: 'ASC' | 'DESC';
  }

  @InputType()
  class Offset implements CrudOffsetOptions {
    @Field(() => Int, { nullable: true })
    page?: number;

    @Field(() => Int, { nullable: true })
    limit?: number;
  }

  @InputType()
  class Pagination implements CrudPaginationOptions {
    @Field(() => Offset, { nullable: true })
    offset?: Offset;
  }

  @InputType()
  class Options implements CrudFindOptions<Entity> {
    @Field(() => Sort, { nullable: true })
    sort?: Sort;

    @Field(() => Pagination, { nullable: true })
    pagination?: Pagination;
  }

  return Options;
}
