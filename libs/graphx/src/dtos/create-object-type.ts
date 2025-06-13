/*
Author: Phu Vo (vovanphu1012@gmail.com)
create-object-type.ts (c) 2025
*/

import { SetMetadata } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { getAutoFields, isAutoObjectType } from '../decorators';
import { ClassType } from '../types';

const classes: Record<string, any> = {};

export function createObjectType<T extends ClassType<any>>(
  EntityClass: T,
): ClassType<T> {
  const className = `${EntityClass.name}`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['read']);

    @ObjectType(className)
    @SetMetadata('Entity', EntityClass)
    class ObjectTypeClass {
      [key: string]: any;
    }

    fields.forEach((field) => {
      const fieldOptions = { ...field.fieldOptions };
      fieldOptions.nullable = true;

      const TypeClass = field.typeFn();

      if (isAutoObjectType(TypeClass)) {
        Field(() => createObjectType(TypeClass), fieldOptions)(
          ObjectTypeClass.prototype,
          field.name,
        );
      } else {
        Field(field.typeFn, fieldOptions)(
          ObjectTypeClass.prototype,
          field.name,
        );
      }
    });

    classes[className] = ObjectTypeClass;
  }

  return classes[className];
}
