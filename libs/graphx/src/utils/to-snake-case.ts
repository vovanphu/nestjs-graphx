/*
Author: Phu Vo (vovanphu1012@gmail.com)
to-snake-case.ts (c) 2025
*/

export function toSnakeCase(text: string): string {
  let result = text.replace(/[^a-zA-Z0-9]/g, ' ');

  result = result.replace(/(?<!^)([A-Z])/g, '_$1');
  result = result.replace(/\s+/g, '_');
  result = result.toLowerCase();
  result = result.replace(/^_+|_+$/g, '');

  return result;
}
