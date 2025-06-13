/*
Author: Phu Vo (vovanphu1012@gmail.com)
upper-case-first-letter.ts (c) 2025
*/

export function upperCaseFirstLetter(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const firstChar = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1);

  return firstChar + restOfString;
}
