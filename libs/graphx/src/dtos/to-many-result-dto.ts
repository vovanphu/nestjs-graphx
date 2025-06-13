/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-many-result-dto.ts (c) 2025
*/

import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  ClassType,
  CrudManyResult,
  CrudOffsetManyResult,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../types';
import { createObjectType } from './create-object-type';

const classes: Record<string, any> = {};

export function toManyResultDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<CrudManyResult<Entity>> {
  const className = `Many${EntityClass.name}Result`;

  if (!classes[className]) {
    const EntityObjectType = createObjectType(EntityClass);

    @ObjectType(className)
    class OffsetManyResult implements CrudOffsetManyResult<Entity> {
      @Field(() => [EntityObjectType])
      entities: Entity[] = [];

      @Field(() => Int)
      total = 0;

      @Field(() => Int)
      pages = 0;

      @Field(() => Int)
      page = DEFAULT_PAGINATION_PAGE;

      @Field(() => Int)
      limit = DEFAULT_PAGINATION_LIMIT;
    }

    classes[className] = OffsetManyResult;
  }

  return classes[className];
}
