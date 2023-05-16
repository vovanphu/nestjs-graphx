import {
  Field,
  Float,
  InputType,
  Int,
  IntersectionType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';
import { getFieldsAndDecoratorForType } from './utils';

export interface ClassType<T> extends Function {
  new (...args: any[]): T;
}

export type ID = string | number;

export type WithIdType<T> = T & { id: ID };

export type CreateType<Dto> = DeepPartial<Dto>;

export type UpdateType<Dto> = WithIdType<DeepPartial<Dto>>;

export type IdentifyType<Dto> = WithIdType<DeepPartial<Dto>>;

export interface CrudFindManyOptions<Entity> {
  filter?: FilterOptions<Entity>;
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

export type StringFilterOperator = {
  equal?: string;
  like?: string;
  notLike?: string;
  in?: string[];
  notIn?: string[];
};

@InputType()
export class StringFilterOptions {
  @Field(() => String, { nullable: true })
  equal?: string;

  @Field(() => String, { nullable: true })
  like?: string;

  @Field(() => String, { nullable: true })
  notLike?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];
}

@InputType()
export class IDFilterOptions {
  @Field(() => String, { nullable: true })
  equal?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];
}

export type BooleanFilterOperator = {
  is?: boolean;
  isNot?: boolean;
};

@InputType()
export class BooleanFilterOptions {
  @Field(() => Boolean, { nullable: true })
  is?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNot?: boolean;
}

export type NumberFilterOperator = {
  equal?: number;
  greater?: number;
  greaterOrEqual?: number;
  lesser?: number;
  lesserOrEqual?: number;
  in?: string[];
  notIn?: string[];
};

@InputType()
export class IntFilterOptions {
  @Field(() => Int, { nullable: true })
  equal?: number;

  @Field(() => Int, { nullable: true })
  greater?: number;

  @Field(() => Int, { nullable: true })
  greaterOrEqual?: number;
  lesser?: number;

  @Field(() => Int, { nullable: true })
  lesserOrEqual?: number;

  @Field(() => [Int], { nullable: true })
  in?: string[];

  @Field(() => [Int], { nullable: true })
  notIn?: string[];
}

@InputType()
export class FloatFilterOptions {
  @Field(() => Float, { nullable: true })
  equal?: number;

  @Field(() => Float, { nullable: true })
  greater?: number;

  @Field(() => Float, { nullable: true })
  greaterOrEqual?: number;
  lesser?: number;

  @Field(() => Float, { nullable: true })
  lesserOrEqual?: number;

  @Field(() => [Float], { nullable: true })
  in?: string[];

  @Field(() => [Float], { nullable: true })
  notIn?: string[];
}

export type DateFilterOperator = {
  equal?: Date;
  greater?: Date;
  greaterOrEqual?: Date;
  lesser?: Date;
  lesserOrEqual?: Date;
};

@InputType()
export class DateFilterOptions {
  @Field(() => String, { nullable: true })
  equal?: Date;

  @Field(() => String, { nullable: true })
  greater?: Date;

  @Field(() => String, { nullable: true })
  greaterOrEqual?: Date;

  @Field(() => String, { nullable: true })
  lesser?: Date;

  @Field(() => String, { nullable: true })
  lesserOrEqual?: Date;
}

export type FilterGroup<Entity> = {
  and?: FilterOptions<Entity>[];
  or?: FilterOptions<Entity>[];
};

export type FilterOperator<Entity> = {
  [Field in keyof Entity]?: FieldFilterOperator<Entity[Field]>;
};

export type FieldFilterOperator<Type> = Type extends string
  ? StringFilterOperator
  : Type extends boolean
  ? BooleanFilterOperator
  : never;

export type FilterOptions<Entity> = FilterGroup<Entity> &
  FilterOperator<Entity>;

export interface CrudQueryService<Entity, Dto> {
  create(record: DeepPartial<Dto>): Promise<CrudOneResult<Entity>>;

  find(record: WithIdType<DeepPartial<Dto>>): Promise<CrudOneResult<Entity>>;

  findMany(
    options: CrudFindManyOptions<Entity>,
  ): Promise<CrudManyResult<Entity>>;

  update(record: WithIdType<DeepPartial<Dto>>): Promise<CrudOneResult<Entity>>;

  softDelete?(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>>;

  restore?(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>>;

  delete(record: WithIdType<DeepPartial<Dto>>): Promise<CrudOneResult<Entity>>;
}

export function descriptorOf(fn: () => void): TypedPropertyDescriptor<any> {
  return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(fn), fn.name);
}

const classes: Record<string, any> = {};

export function createInputType<ObjectType extends ClassType<any>>(
  ObjectTypeClass: ObjectType,
): ClassType<any> {
  const className = `InputType${ObjectTypeClass.name}`;

  if (!classes[className]) {
    const { fields } = getFieldsAndDecoratorForType(ObjectTypeClass);
    @InputType(className)
    class InputTypeClass {}

    fields.forEach((item) => {
      Field(item.typeFn, { ...item.options })(
        InputTypeClass.prototype,
        item.name,
      );
    });

    classes[className] = InputTypeClass;
  }

  return classes[className];
}

export function toCreateDto<Dto extends ClassType<any>>(
  DtoClass: Dto,
): ClassType<any> {
  const className = `Create${DtoClass.name}`;

  if (!classes[className]) {
    @InputType(className)
    class CreateDto extends OmitType(DtoClass, ['id']) {}
    classes[className] = CreateDto;
  }
  return classes[className];
}

export function toUpdateDto<Dto extends ClassType<any>>(
  DtoClass: Dto,
): ClassType<any> {
  const className = `Update${DtoClass.name}`;

  if (!classes[className]) {
    @InputType(className)
    class UpdateDto extends IntersectionType(
      PickType(DtoClass, ['id']),
      PartialType(DtoClass),
    ) {}

    classes[className] = UpdateDto;
  }
  return classes[className];
}

export function toFilterDto<Entity>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  const className = `FilterOptions${EntityClass.name}`;

  if (!classes[className]) {
    const { fields } = getFieldsAndDecoratorForType(EntityClass);

    @InputType(className)
    class FilterGroupClass {
      @Field(() => [FilterGroupClass], { nullable: true })
      and?: FilterGroupClass[];

      @Field(() => [FilterGroupClass], { nullable: true })
      or?: FilterGroupClass[];
    }

    fields.forEach((field) => {
      if (field.typeFn() === String) {
        Field(() => StringFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === Boolean) {
        Field(() => BooleanFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === Int) {
        Field(() => IntFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === Date) {
        Field(() => DateFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
    });

    classes[className] = FilterGroupClass;
  }

  return classes[className];
}

export function toIdentifyDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<any> {
  const className = `Identify${EntityClass.name}`;

  @InputType()
  class InputTypeClass extends createInputType(EntityClass) {}

  if (!classes[className]) {
    @InputType(className)
    class IdentifyDto extends PartialType(InputTypeClass) {}
    classes[className] = IdentifyDto;
  }

  return classes[className];
}

export function toCrudManyResult<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<any> {
  const className = `OffsetManyResult${EntityClass.name}`;

  if (!classes[className]) {
    @ObjectType(className)
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
    classes[className] = OffsetManyResult;
  }

  return classes[className];
}

export function toCrudOneResult<Entity>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  const className = `OneResult${EntityClass.name}`;

  if (!classes[className]) {
    @ObjectType(className)
    class OneResult implements CrudOneResult<Entity> {
      @Field(() => EntityClass, { nullable: true })
      entity?: Entity;
    }
    classes[className] = OneResult;
  }
  return classes[className];
}

export function toCrudFindManyOptions<Entity>(
  EntityClass: ClassType<Entity>,
): ClassType<any> {
  const className = `FindManyOptions${EntityClass.name}`;

  if (!classes[className]) {
    @InputType(`SortOptions${EntityClass.name}`)
    class Sort implements CrudSortOptions<Entity> {
      @Field(() => String, { nullable: true })
      field?: 'updatedAt' | (string & keyof Entity);

      @Field(() => String, { nullable: true })
      direction?: 'ASC' | 'DESC';
    }

    @InputType(`OffsetOptions${EntityClass.name}`)
    class Offset implements CrudOffsetOptions {
      @Field(() => Int, { nullable: true })
      page?: number;

      @Field(() => Int, { nullable: true })
      limit?: number;
    }

    @InputType(`PaginationOptions${EntityClass.name}`)
    class Pagination implements CrudPaginationOptions {
      @Field(() => Offset, { nullable: true })
      offset?: Offset;
    }

    const Filter = toFilterDto(EntityClass);

    @InputType(className)
    class Options implements CrudFindManyOptions<Entity> {
      @Field(() => Filter as ClassType<any>, { nullable: true })
      filter?: FilterOptions<Entity>;

      @Field(() => Sort, { nullable: true })
      sort?: Sort;

      @Field(() => Pagination, { nullable: true })
      pagination?: Pagination;
    }

    classes[className] = Options;
  }

  return classes[className];
}
