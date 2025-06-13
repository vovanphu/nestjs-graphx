/*
Author: Phu Vo (vovanphu1012@gmail.com)
auto-field.decorator.ts (c) 2025
*/

import { FieldOptions } from '@nestjs/graphql';
import { ClassType } from '../types';
import { isAutoObjectType } from './auto-object-type.decorator';

export const AUTO_FIELD_WATERMARK = Symbol('AUTO_FIELD_WATERMARK');

export type AutoFieldViewPolicyMode = 'create' | 'update' | 'read' | 'hidden';

export const DEFAULT_VIEW_POLICY: AutoFieldViewPolicyMode[] = [
  'read',
  'create',
  'update',
];

export interface AutoFieldOptions {
  typeFn: () => any;
  viewPolicy?: AutoFieldViewPolicyMode[];
  fieldOptions?: FieldOptions;
}

export interface AutoFieldMetadata extends AutoFieldOptions {
  name: string;
}

export function AutoField(options: AutoFieldOptions): PropertyDecorator {
  return function (prototype: any, name: string) {
    const { typeFn } = options;
    let { viewPolicy, fieldOptions } = options;

    viewPolicy = viewPolicy ?? DEFAULT_VIEW_POLICY;
    fieldOptions = fieldOptions ?? {};

    const meta = [
      ...(Reflect.getMetadata(AUTO_FIELD_WATERMARK, prototype) ?? []),
    ];

    const field = {
      name,
      typeFn,
      fieldOptions,
      viewPolicy,
    };

    if (!meta.some((f: AutoFieldMetadata) => f.name === name)) {
      meta.push(field);
    }

    Reflect.defineMetadata(AUTO_FIELD_WATERMARK, meta, prototype);
  };
}

export function getAutoFields(
  target: ClassType<any>,
  viewPolicy?: AutoFieldViewPolicyMode[],
): AutoFieldMetadata[] {
  const activeViews = viewPolicy ?? DEFAULT_VIEW_POLICY;
  const isHiddenIncluded = activeViews.includes('hidden');

  const fields: AutoFieldMetadata[] =
    Reflect.getMetadata(AUTO_FIELD_WATERMARK, target.prototype) || [];

  return fields.filter((field) => {
    if (field.viewPolicy.includes('hidden') && !isHiddenIncluded) return false;
    if (isAutoObjectType(field.typeFn())) return activeViews.includes('read');
    return activeViews.some((view) => field.viewPolicy.includes(view));
  });
}
