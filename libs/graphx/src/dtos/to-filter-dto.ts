/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-filter-dto.ts (c) 2025
*/

import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { getAutoFields, isAutoObjectType } from '../decorators';
import {
  BooleanFilterOptions,
  DateFilterOptions,
  IDFilterOptions,
  IntFilterOptions,
  StringFilterOptions,
} from '../filters';
import { ClassType, FilterOptions } from '../types';

const classes: Record<string, any> = {};

export function toFilterDto<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<FilterOptions<Entity>> {
  const className = `Filter${EntityClass.name}Options`;

  if (!classes[className]) {
    const fields = getAutoFields(EntityClass, ['read']);

    @InputType(className)
    class FilterGroupClass {
      @Field(() => [FilterGroupClass], { nullable: true })
      and?: FilterGroupClass[];

      @Field(() => [FilterGroupClass], { nullable: true })
      or?: FilterGroupClass[];
    }

    fields.forEach((field) => {
      if (isAutoObjectType(field.typeFn())) {
        return;
      }
      if (field.typeFn() === ID) {
        Field(() => IDFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === String) {
        Field(() => StringFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === Boolean) {
        Field(() => BooleanFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === Int) {
        Field(() => IntFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
      if (field.typeFn() === Date) {
        Field(() => DateFilterOptions, { nullable: true })(
          FilterGroupClass.prototype,
          field.name,
        );
      }
    });

    classes[className] = FilterGroupClass;
  }

  return classes[className];
}
