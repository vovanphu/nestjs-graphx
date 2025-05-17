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
