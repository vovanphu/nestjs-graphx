import { DeepPartial } from 'typeorm';
import { CrudFindManyOptions } from './crud-options';

export interface ClassConstructor<T> {
  new (...args: any[]): T;
}

export type WithIdType<T> = T & { id: string | number };

export type IdentifyType<T> = WithIdType<DeepPartial<T>>;
export type CrudCreateType<T> = DeepPartial<T>;
export type CrudFindType<T> = DeepPartial<T>;
export type CrudFindManyType<T> = CrudFindManyOptions<T>;
export type CrudUpdateType<T> = WithIdType<DeepPartial<T>>;
