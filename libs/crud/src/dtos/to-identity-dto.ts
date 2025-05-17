import { Field, ID, InputType } from '@nestjs/graphql';
import { getAutoFields } from '../decorators';
import { ClassConstructor } from '../types';

const classes: Record<string, any> = {};

export function toIdentityDto<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<Entity> {
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
      Field(field.typeFn, { ...field.fieldOptions })(
        IdentityDto.prototype,
        field.name,
      );
    });

    classes[className] = IdentityDto;
  }

  return classes[className];
}
