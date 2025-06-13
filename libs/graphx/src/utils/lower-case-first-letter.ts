/*
Author: Phu Vo (vovanphu1012@gmail.com)
lower-case-first-letter.ts (c) 2025
*/

export function lowerCaseFirstLetter(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const firstChar = str.charAt(0).toLowerCase();
  const restOfString = str.slice(1);

  return firstChar + restOfString;
}
