/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-update-dto.ts (c) 2025
*/

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
import { ClassType, CrudUpdateType } from '../types';

const classes: Record<string, any> = {};

export function toUpdateDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<CrudUpdateType<Entity>> {
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

    // const ownedAutoRelations = getOwnedAutoRelations(EntityClass);

    // ownedAutoRelations.forEach((relation) => {
    //   if (!['one-to-one', 'many-to-one'].includes(relation.type)) return;

    //   Field(() => ID, { nullable: relation.nullable })(
    //     BaseUpdateDto.prototype,
    //     relation.joinColumn,
    //   );
    // });

    @InputType(className)
    class UpdateDto extends IntersectionType(
      PickType(BaseUpdateDto, identityFieldsNames),
      PartialType(OmitType(BaseUpdateDto, identityFieldsNames)),
    ) {}

    classes[className] = UpdateDto;
  }

  return classes[className];
}
