import { SetMetadata } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { getAutoFields } from '../decorators';
import { ClassConstructor } from '../types';

const classes: Record<string, any> = {};

export function createObjectType<T extends ClassConstructor<any>>(
  EntityClass: T,
): ClassConstructor<T> {
  const className = `${EntityClass.name}`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['read']);

    @ObjectType(className)
    @SetMetadata('Entity', EntityClass)
    class ObjectTypeClass {
      [key: string]: any;
    }

    fields.forEach((field) => {
      Field(field.typeFn, { ...field.fieldOptions })(
        ObjectTypeClass.prototype,
        field.name,
      );
    });

    classes[className] = ObjectTypeClass;
  }

  return classes[className];
}
