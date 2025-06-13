/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud-options.ts (c) 2025
*/

import { FilterOptions } from '.';

export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_LIMIT = 10;
export const DEFAULT_SORT_FIELD = 'updatedAt';
export const DEFAULT_SORT_DIRECTION = 'DESC';

export interface CrudFindManyOptions<Entity> {
  filter?: FilterOptions<Entity>;
  sort?: CrudSortOptions<Entity>;
  pagination?: CrudPaginationOptions;
}

export interface CrudSortOptions<Entity> {
  field?: keyof Entity | 'updatedAt';
  direction?: 'ASC' | 'DESC';
}

export interface CrudPaginationOptions {
  offset?: CrudOffsetOptions;
}

export interface CrudOffsetOptions {
  page?: number;
  limit?: number;
}
