/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-find-many-options-dto.ts (c) 2025
*/

import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ClassType,
  CrudFindManyOptions,
  CrudOffsetOptions,
  CrudPaginationOptions,
  CrudSortOptions,
  FilterOptions,
} from '../types';
import { toFilterDto } from './to-filter-dto';

const classes: Record<string, any> = {};

export function toFindManyOptionsDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<CrudFindManyOptions<Entity>> {
  const className = `FindMany${EntityClass.name}Options`;

  if (!classes[className]) {
    @InputType(`Sort${EntityClass.name}Options`)
    class Sort implements CrudSortOptions<Entity> {
      @Field(() => String, { nullable: true })
      field?: 'updatedAt' | (string & keyof Entity);

      @Field(() => String, { nullable: true })
      direction?: 'ASC' | 'DESC';
    }

    @InputType(`Offset${EntityClass.name}Options`)
    class Offset implements CrudOffsetOptions {
      @Field(() => Int, { nullable: true })
      page?: number;

      @Field(() => Int, { nullable: true })
      limit?: number;
    }

    @InputType(`Pagination${EntityClass.name}Options`)
    class Pagination implements CrudPaginationOptions {
      @Field(() => Offset, { nullable: true })
      offset?: Offset;
    }

    const Filter = toFilterDto(EntityClass);

    @InputType(className)
    class Options implements CrudFindManyOptions<Entity> {
      @Field(() => Filter, { nullable: true })
      filter?: FilterOptions<Entity>;

      @Field(() => Sort, { nullable: true })
      sort?: CrudSortOptions<Entity>;

      @Field(() => Pagination, { nullable: true })
      pagination?: CrudPaginationOptions;
    }

    classes[className] = Options;
  }

  return classes[className];
}
