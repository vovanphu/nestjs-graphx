/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-create-dto.ts (c) 2025
*/

import { Field, InputType } from '@nestjs/graphql';
import { getAutoFields } from '../decorators';
import { ClassType } from '../types';

const classes: Record<string, any> = {};

export function toCreateDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<Entity> {
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

    // const ownedAutoRelations = getOwnedAutoRelations(EntityClass);

    // ownedAutoRelations.forEach((relation) => {
    //   if (!['one-to-one', 'many-to-one'].includes(relation.type)) return;

    //   Field(() => ID, { nullable: relation.nullable })(
    //     CreateDto.prototype,
    //     relation.joinColumn,
    //   );
    // });

    classes[className] = CreateDto;
  }

  return classes[className];
}
