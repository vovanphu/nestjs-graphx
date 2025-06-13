/*
Author: Phu Vo (vovanphu1012@gmail.com)
auto-object-type.decorator.ts (c) 2025
*/

import { ClassType } from '../types';
import { toSnakeCase } from '../utils';

export const AUTO_OBJECT_TYPE_WARTERMARK = Symbol(
  'AUTO_OBJECT_TYPE_WARTERMARK',
);

export interface AutoObjectTypeOptions {
  tableOrCollection?: string;
}

export type AutoObjectTypeMetadata = AutoObjectTypeOptions;

export function AutoObjectType(
  options?: AutoObjectTypeOptions,
): ClassDecorator {
  return function (prototype: any) {
    options = options || {};

    const metadata = { ...options };

    metadata.tableOrCollection =
      metadata.tableOrCollection || toSnakeCase(prototype.name);

    Reflect.defineMetadata(AUTO_OBJECT_TYPE_WARTERMARK, metadata, prototype);
  };
}

export function getAutoObjectTypeMetadata(
  target: ClassType<any>,
): AutoObjectTypeMetadata {
  return Reflect.getMetadata(AUTO_OBJECT_TYPE_WARTERMARK, target);
}

export function isAutoObjectType(target: ClassType<any>): boolean {
  if (!target.prototype) return false;
  return !!Reflect.getMetadata(AUTO_OBJECT_TYPE_WARTERMARK, target);
}
