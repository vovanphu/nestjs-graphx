/*
Author: Phu Vo (vovanphu1012@gmail.com)
extract-ordered-param-keys.ts (c) 2025
*/

export function extractOrderedParamKeys(
  query: string,
  allowDuplicate = true,
): string[] {
  const regex = /:([a-zA-Z0-9_]+)/g;
  const keys = [];
  const seen = new Set<string>();

  let matchs: string[];
  while ((matchs = regex.exec(query)) !== null) {
    const key = matchs[1];
    if (!allowDuplicate && seen.has(key)) continue;
    keys.push(key);
    seen.add(key);
  }

  return keys;
}
