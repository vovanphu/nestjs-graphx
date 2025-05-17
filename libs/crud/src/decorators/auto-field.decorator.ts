import { FieldOptions } from '@nestjs/graphql';
import { ClassConstructor } from '../types';

const AUTO_FIELD_WATERMARK = Symbol('AUTO_FIELD_WATERMARK');

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
  return function (target: any, name: string) {
    const { typeFn } = options;
    let { viewPolicy, fieldOptions } = options;

    viewPolicy = viewPolicy ?? DEFAULT_VIEW_POLICY;
    fieldOptions = fieldOptions ?? {};

    const meta = [...(Reflect.getMetadata(AUTO_FIELD_WATERMARK, target) ?? [])];

    const field = {
      name,
      typeFn,
      fieldOptions,
      viewPolicy,
    };

    if (!meta.some((f: AutoFieldMetadata) => f.name === name)) {
      meta.push(field);
    }

    Reflect.defineMetadata(AUTO_FIELD_WATERMARK, meta, target);
  };
}

export function getAutoFields(
  target: ClassConstructor<any>,
  viewPolicy?: AutoFieldViewPolicyMode[],
): AutoFieldMetadata[] {
  const activeViews = viewPolicy ?? DEFAULT_VIEW_POLICY;

  const fields: AutoFieldMetadata[] =
    Reflect.getMetadata(AUTO_FIELD_WATERMARK, target.prototype) || [];

  return fields.filter((field) => {
    if (field.viewPolicy.includes('hidden')) return false;
    if (field.viewPolicy.includes('hidden')) return false;
    return activeViews.some((view) => field.viewPolicy.includes(view));
  });
}
