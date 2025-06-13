/*
Author: Phu Vo (vovanphu1012@gmail.com)
extract-property-name.ts (c) 2025
*/

export function extractPropertyName<T>(fn: (obj: T) => any): string {
  let propName: string | undefined;

  const proxy = new Proxy(
    {},
    {
      get(_, key) {
        propName = key.toString();
        return undefined;
      },
    },
  );

  fn(proxy as any);
  return propName as string;
}
