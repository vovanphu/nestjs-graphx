/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-one-result-dto.ts (c) 2025
*/

import { Field, ObjectType } from '@nestjs/graphql';
import { ClassType, CrudOneResult } from '../types';
import { createObjectType } from './create-object-type';

const classes: Record<string, any> = {};

export function toOneResultDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<CrudOneResult<Entity>> {
  const className = `One${EntityClass.name}Result`;

  if (!classes[className]) {
    const EntityObjectType = createObjectType(EntityClass);

    @ObjectType(className)
    class OneResult {
      @Field(() => EntityObjectType, { nullable: true })
      entity?: Entity;
    }

    classes[className] = OneResult;
  }

  return classes[className];
}
