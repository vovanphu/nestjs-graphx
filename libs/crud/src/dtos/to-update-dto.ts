import {
  Field,
  ID,
  InputType,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { getAutoFields } from '../decorators';
import { ClassConstructor, CrudUpdateType } from '../types';

const classes: Record<string, any> = {};

export function toUpdateDto<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<CrudUpdateType<Entity>> {
  const className = `Update${EntityClass.name}Dto`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['update']);
    const identityFields = fields.filter(
      (field) => typeof field.typeFn === 'function' && field.typeFn() === ID,
    );
    const identityFieldsNames = identityFields.map((field) => field.name);

    @InputType()
    class BaseUpdateDto {
      [key: string]: any;
    }

    fields.forEach((field) => {
      Field(field.typeFn, { ...field.fieldOptions })(
        BaseUpdateDto.prototype,
        field.name,
      );
    });

    @InputType(className)
    class UpdateDto extends IntersectionType(
      PickType(BaseUpdateDto, identityFieldsNames),
      PartialType(OmitType(BaseUpdateDto, identityFieldsNames)),
    ) {}

    classes[className] = UpdateDto;
  }

  return classes[className];
}
