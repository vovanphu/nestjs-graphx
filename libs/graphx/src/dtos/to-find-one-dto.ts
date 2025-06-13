/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-find-one-dto.ts (c) 2025
*/

import { Field, InputType, PartialType } from '@nestjs/graphql';
import { getAutoFields, isAutoObjectType } from '../decorators';
import { ClassType, CrudFindType } from '../types';

const classes: Record<string, any> = {};

export function toFindOneDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<CrudFindType<Entity>> {
  const className = `FindOne${EntityClass.name}Dto`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['read']);

    @InputType(className)
    class BaseFindOneDto {
      [key: string]: any;
    }

    fields.forEach((field) => {
      if (isAutoObjectType(field.typeFn())) return;

      Field(field.typeFn, { ...field.fieldOptions })(
        BaseFindOneDto.prototype,
        field.name,
      );
    });

    @InputType(className)
    class FindOneDto extends PartialType(BaseFindOneDto) {}

    classes[className] = FindOneDto;
  }

  return classes[className];
}
