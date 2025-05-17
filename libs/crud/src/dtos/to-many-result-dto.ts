import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  ClassConstructor,
  CrudManyResult,
  CrudOffsetManyResult,
} from '../types';
import { createObjectType } from './create-object-type';

const classes: Record<string, any> = {};

export function toManyResultDto<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<CrudManyResult<Entity>> {
  const className = `Many${EntityClass.name}Result`;

  if (!classes[className]) {
    const EntityObjectType = createObjectType(EntityClass);

    @ObjectType(className)
    class OffsetManyResult implements CrudOffsetManyResult<Entity> {
      @Field(() => [EntityObjectType])
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
