/*
Author: Phu Vo (vovanphu1012@gmail.com)
resolve-dataloader.ts (c) 2025
*/

import DataLoader from 'dataloader';
import { deepNormalize } from '../utils';

export function createDataLoaderKey(...args: any[]): string {
  const keys = args.map((value) => JSON.stringify(deepNormalize(value)));
  return keys.join('::');
}

export function resolveDataloader<K, V>(
  context: any,
  dataloaderName: string,
  handlerFactory: DataLoader.BatchLoadFn<K, V>,
): DataLoader<K, V> {
  if (!context.dataloaders)
    context.dataloaders = new Map<string, DataLoader<K, V>>();
  if (context.dataloaders[dataloaderName])
    return context.dataloaders[dataloaderName];

  context.dataloaders[dataloaderName] = new DataLoader(handlerFactory, {
    cacheKeyFn: createDataLoaderKey,
  });

  return context.dataloaders[dataloaderName];
}
