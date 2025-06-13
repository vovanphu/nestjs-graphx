/*
Author: Phu Vo (vovanphu1012@gmail.com)
crud-result.ts (c) 2025
*/

export type CrudManyResult<Entity> = CrudOffsetManyResult<Entity>;

export interface CrudOffsetManyResult<Entity> {
  entities: Entity[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface CrudOneResult<Entity> {
  entity?: Entity;
}
