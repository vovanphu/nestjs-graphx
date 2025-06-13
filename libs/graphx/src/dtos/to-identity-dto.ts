/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-identity-dto.ts (c) 2025
*/

import { Field, ID, InputType } from '@nestjs/graphql';
import { getAutoFields, isAutoObjectType } from '../decorators';
import { ClassType } from '../types';

const classes: Record<string, any> = {};

export function toIdentityDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<Entity> {
  const className = `Identity${EntityClass.name}Dto`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass);
    const identityFields = fields.filter(
      (field) => typeof field.typeFn === 'function' && field.typeFn() === ID,
    );

    @InputType(className)
    class IdentityDto {
      [key: string]: any;
    }

    identityFields.forEach((field) => {
      if (isAutoObjectType(field.typeFn())) return;

      Field(field.typeFn, { ...field.fieldOptions })(
        IdentityDto.prototype,
        field.name,
      );
    });

    classes[className] = IdentityDto;
  }

  return classes[className];
}
