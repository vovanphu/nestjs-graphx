import { Field, ObjectType } from '@nestjs/graphql';
import { ClassConstructor, CrudOneResult } from '../types';
import { createObjectType } from './create-object-type';

const classes: Record<string, any> = {};

export function toOneResultDto<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<CrudOneResult<Entity>> {
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
