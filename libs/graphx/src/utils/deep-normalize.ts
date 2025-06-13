/*
Author: Phu Vo (vovanphu1012@gmail.com)
deep-normalize.ts (c) 2025
*/

export function deepNormalize(input: any): any {
  if (input === null || input === undefined) return '';

  if (typeof input === 'bigint') {
    return input.toString();
  }

  if (input instanceof Date) {
    return input.toISOString();
  }

  if (typeof input === 'string') {
    if (!isNaN(Number(input)) && input.trim() !== '') {
      return Number(input);
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(deepNormalize);
  }

  if (typeof input === 'object') {
    const normalizedObj: Record<string, any> = {};
    Object.keys(input)
      .sort()
      .forEach((key) => {
        normalizedObj[key] = deepNormalize(input[key]);
      });
    return normalizedObj;
  }

  if (typeof input === 'boolean') {
    return input.toString();
  }

  return input;
}
