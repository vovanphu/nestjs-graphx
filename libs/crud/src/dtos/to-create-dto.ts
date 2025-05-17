import { Field, InputType } from '@nestjs/graphql';
import { getAutoFields } from '../decorators';
import { ClassConstructor } from '../types';

const classes: Record<string, any> = {};

export function toCreateDto<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<Entity> {
  const className = `Create${EntityClass.name}Dto`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['create']);

    @InputType(className)
    class CreateDto {
      [key: string]: any;
    }

    fields.forEach((field) => {
      Field(field.typeFn, { ...field.fieldOptions })(
        CreateDto.prototype,
        field.name,
      );
    });

    classes[className] = CreateDto;
  }

  return classes[className];
}
