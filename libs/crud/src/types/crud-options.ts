import { FilterOptions } from '.';

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
