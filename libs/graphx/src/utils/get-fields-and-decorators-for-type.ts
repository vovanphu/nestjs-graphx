/*
Author: Phu Vo (vovanphu1012@gmail.com)
get-fields-and-decorators-for-type.ts (c) 2025
*/

import { Type } from '@nestjs/common';
import { getFieldsAndDecoratorForType as rootFunc } from '@nestjs/graphql/dist/schema-builder/utils/get-fields-and-decorator.util';

export function getFieldsAndDecoratorForType<T>(objType: Type<T>) {
  return rootFunc<T>(objType);
}
