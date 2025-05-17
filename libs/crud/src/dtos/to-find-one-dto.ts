import { Field, InputType, PartialType } from '@nestjs/graphql';
import { getAutoFields } from '../decorators';
import { ClassConstructor, CrudFindType } from '../types';

const classes: Record<string, any> = {};

export function toFindOneDto<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<CrudFindType<Entity>> {
  const className = `FindOne${EntityClass.name}Dto`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['read']);

    @InputType(className)
    class BaseFindOneDto {
      [key: string]: any;
    }

    fields.forEach((field) => {
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
