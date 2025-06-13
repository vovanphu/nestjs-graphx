/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud-types.ts (c) 2025
*/

import { DeepPartial } from 'typeorm';
import { CrudFindManyOptions } from './crud-options';

export interface ClassType<T> {
  new (...args: any[]): T;
}

export interface WithId<ID = string | number> {
  id: ID;
}

export type WithIdType<T> = T & { id: string | number };

export type IdentifyType<T> = WithIdType<DeepPartial<T>>;
export type CrudCreateType<T> = DeepPartial<T>;
export type CrudFindType<T> = DeepPartial<T>;
export type CrudFindManyType<T> = CrudFindManyOptions<T>;
export type CrudUpdateType<T> = WithIdType<DeepPartial<T>>;
