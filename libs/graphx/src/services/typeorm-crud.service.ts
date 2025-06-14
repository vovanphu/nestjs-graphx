/*
Author: Phu Vo (vovanphu1012@gmail.com)
typeorm-crud.service.ts (c) 2025
*/

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DataSource,
  DeepPartial,
  EntityMetadata,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import {
  AutoRelationJoinTable,
  AutoRelationMetadata,
  getAutoObjectTypeMetadata,
  getOwnedAutoRelation,
  getOwnedInverseAutoRelation,
  retrieveInverseSide,
} from '../decorators';
import {
  ClassType,
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudManyResult,
  CrudOffsetOptions,
  CrudOneResult,
  CrudPaginationOptions,
  CrudQueryInterface,
  CrudSortOptions,
  CrudUpdateType,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  FilterOperator,
  FilterOptions,
} from '../types';
import { extractOrderedParamKeys, lowerCaseFirstLetter } from '../utils';

export function applyFilter<Entity>(
  queryBuilder: SelectQueryBuilder<Entity> | WhereExpressionBuilder,
  metadata: EntityMetadata,
  options: FilterOptions<Entity>,
  alias: string = metadata.targetName,
): void {
  options = options || {};
  Object.keys(options).forEach((key) => {
    const tempKey = `${key}_${Math.round(Math.random() * 10000)}`;
    const operators: FilterOperator<Entity> = options[key] || {};
    const column: ColumnMetadata = metadata.columns.find(
      (column) => column.propertyName === key,
    );

    if (!column) {
      throw new BadRequestException(
        `Column ${key} not found in entity ${metadata.name}`,
      );
    }

    const fullKey = `${alias}.${key}`;

    /**
     * # TODO Allow FilterGroup and FilterOperators exist in the same time may cause unexpected behaviors.
     * For example, check the result of this filter:
     * {
     *   and: [
     *    {
     *       and : [ { name: { equal: 'John' }} ]
     *    }
     *   ]
     * }
     */

    if (key === 'and') {
      const filters = options[key] || [];
      queryBuilder.andWhere(
        new Brackets((qb) => {
          filters.forEach((filter) => {
            qb.andWhere(
              new Brackets((sqb) => {
                applyFilter(sqb, metadata, filter);
              }),
            );
          });
        }),
      );
    } else if (key === 'or') {
      const filters = options[key] || [];
      queryBuilder.andWhere(
        new Brackets((qb) => {
          filters.forEach((filter) => {
            qb.orWhere(
              new Brackets((sqb) => {
                applyFilter(sqb, metadata, filter);
              }),
            );
          });
        }),
      );
    } else if (column.type === Number) {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'equal') {
          queryBuilder.andWhere(`${fullKey} = :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'greater') {
          queryBuilder.andWhere(`${fullKey} > :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'greaterOrEqual') {
          queryBuilder.andWhere(`${fullKey} >= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesser') {
          queryBuilder.andWhere(`${fullKey} < :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesserOrEqual') {
          queryBuilder.andWhere(`${fullKey} <= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'empty' && opValue) {
          queryBuilder.andWhere(`${fullKey} IS NULL`);
        } else if (opKey === 'notEmpty' && opValue) {
          queryBuilder.andWhere(`${fullKey} IS NOT NULL`);
        } else if (opKey === 'in') {
          queryBuilder.andWhere(`${fullKey} IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'notIn') {
          queryBuilder.andWhere(`${fullKey} NOT IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        }
      });
    } else if (column.type === Boolean) {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'is') {
          queryBuilder.andWhere(`${fullKey} = :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'isNot') {
          queryBuilder.andWhere(`${fullKey} <> :${tempKey}`, {
            [tempKey]: opValue,
          });
        }
      });
    } else if (column.type === String) {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'equal') {
          queryBuilder.andWhere(`${fullKey} = :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'like') {
          queryBuilder.andWhere(`${fullKey} LIKE :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'notLike') {
          queryBuilder.andWhere(`${fullKey} NOT LIKE :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'empty' && opValue) {
          queryBuilder.andWhere(`${fullKey} IS NULL`);
        } else if (opKey === 'notEmpty' && opValue) {
          queryBuilder.andWhere(`${fullKey} IS NOT NULL`);
        } else if (opKey === 'in') {
          queryBuilder.andWhere(`${fullKey} IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'notIn') {
          queryBuilder.andWhere(`${fullKey} NOT IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        }
      });
    } else if (column.type === 'datetime') {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'equal') {
          queryBuilder.andWhere(`DATE(${fullKey}) = :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'greater') {
          queryBuilder.andWhere(`DATE(${fullKey}) > :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'greaterOrEqual') {
          queryBuilder.andWhere(`DATE(${fullKey}) >= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesser') {
          queryBuilder.andWhere(`DATE(${fullKey}) < :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesserOrEqual') {
          queryBuilder.andWhere(`DATE(${fullKey}) <= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'empty' && opValue) {
          queryBuilder.andWhere(`${fullKey} IS NULL`);
        } else if (opKey === 'notEmpty' && opValue) {
          if (
            column.isDeleteDate &&
            queryBuilder instanceof SelectQueryBuilder
          ) {
            queryBuilder.withDeleted();
          }
          queryBuilder.andWhere(`${fullKey} IS NOT NULL`);
        }
      });
    }
  });
}

export async function applySort<Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: CrudSortOptions<Entity>,
): Promise<void> {
  const aliasName = queryBuilder.expressionMap.mainAlias.name;
  const { field, direction } = options;
  queryBuilder.addOrderBy(`${aliasName}.${String(field)}`, direction);
  queryBuilder.addOrderBy(`${aliasName}.id`, direction); // # Is this necessary?
}

export async function applyOffsetPaginate<Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: CrudOffsetOptions,
): Promise<void> {
  queryBuilder.skip((options.page - 1) * options.limit).take(options.limit);
}

export async function offsetPaginate<Entity>( // # TODO Check its name, this function does more than just offset paginate
  repo: Repository<Entity>,
  filterOptions: FilterOptions<Entity>,
  sortOptions: CrudSortOptions<Entity> = {},
  offsetPaginateOptions: CrudOffsetOptions = {},
): Promise<CrudManyResult<Entity>> {
  const queryBuilder = repo.createQueryBuilder();
  const metadata = repo.metadata;
  applyFilter(queryBuilder, metadata, filterOptions);
  applySort(queryBuilder, sortOptions);
  applyOffsetPaginate(queryBuilder, offsetPaginateOptions);
  const total = await queryBuilder.getCount();
  return {
    entities: await queryBuilder.getMany(),
    total,
    pages: Math.ceil(total / offsetPaginateOptions.limit),
    page: offsetPaginateOptions.page,
    limit: offsetPaginateOptions.limit,
  };
}

export function resolveSortandOffsetPaginateOptions<Entity>(
  sortOptions: CrudSortOptions<Entity>,
  offsetPaginateOptions: CrudOffsetOptions,
): void {
  // This function just provide default values
  sortOptions.field = sortOptions.field || DEFAULT_SORT_FIELD;
  sortOptions.direction = sortOptions.direction || DEFAULT_SORT_DIRECTION;
  offsetPaginateOptions.page =
    offsetPaginateOptions.page || DEFAULT_PAGINATION_PAGE;
  offsetPaginateOptions.limit =
    offsetPaginateOptions.limit || DEFAULT_PAGINATION_LIMIT;
}

export async function queryAndPaginate<Entity>(
  repo: Repository<Entity>,
  filterOptions: FilterOptions<Entity>,
  sortOptions: CrudSortOptions<Entity>,
  paginateOptions: CrudPaginationOptions,
): Promise<CrudManyResult<Entity>> {
  // This function just provide default values
  sortOptions = sortOptions || {};
  const offsetPaginateOptions = paginateOptions?.offset || {};
  resolveSortandOffsetPaginateOptions(sortOptions, offsetPaginateOptions);

  return offsetPaginate(
    repo,
    filterOptions,
    sortOptions,
    offsetPaginateOptions,
  );
}

export function buildTypeOrmUnionQuery<T = any>(
  queryBuilders: SelectQueryBuilder<T>[],
  dialect: 'mysql' | 'sqlite' | 'mariadb' | 'postgres' = 'mysql',
  unionType: 'UNION' | 'UNION ALL' = 'UNION',
): { query: string; parameters: any[] } {
  let paramIndex = 1;
  const unionParts = [];
  const parameters = [];

  queryBuilders.forEach((queryBuilder) => {
    let query = queryBuilder.getQuery();
    const keys = extractOrderedParamKeys(query);
    const params = queryBuilder.getParameters();

    keys.forEach((key) => {
      const newKey = dialect === 'postgres' ? `$${paramIndex++}` : '?';
      query = query.replace(new RegExp(`:${key}\\b`), newKey);
      parameters.push(params[key]);
    });

    unionParts.push(query);
  });

  const query = unionParts.join(`\n${unionType}\n`);

  return { query, parameters };
}

export function TypeOrmCrudServiceFactory<Entity extends ClassType<any>>(
  EntityClass: Entity,
): ClassType<CrudQueryInterface<Entity>> {
  const dataSourceSymbol = Symbol(`DataSource${EntityClass.name}`);
  const repoSymbol = Symbol(`Repository${EntityClass.name}`);

  @Injectable()
  class TypeOrmCrudService<Entity> implements CrudQueryInterface<Entity> {
    @Inject(DataSource) readonly [dataSourceSymbol]: DataSource;
    @InjectRepository(EntityClass) readonly [repoSymbol]: Repository<Entity>;

    async create(
      record: CrudCreateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return {
        entity: await this[repoSymbol].save(record as Entity),
      };
    }

    async find(record: CrudFindType<Entity>): Promise<CrudOneResult<Entity>> {
      const queryBuilder = this[repoSymbol].createQueryBuilder();
      let fieldCounter = 1;

      for (const field in record as any) {
        const fieldPlaceholder = `${field}_${fieldCounter}`;
        fieldCounter++;

        queryBuilder.andWhere(`${field} = :${fieldPlaceholder}`, {
          [fieldPlaceholder]: record[field],
        });
      }

      return {
        entity: await queryBuilder.getOne(),
      };
    }

    async findById(entityId: string | number): Promise<CrudOneResult<Entity>> {
      return {
        entity: await this[repoSymbol].findOneBy({ id: entityId } as any),
      };
    }

    async findMany(
      options: CrudFindManyType<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      options = options || {};
      return queryAndPaginate(
        this[repoSymbol],
        options?.filter,
        options?.sort,
        options?.pagination,
      );
    }

    async update(
      record: CrudUpdateType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const { id, ...rest } = record;
      const { entity } = await this.findById({ id } as any);

      if (!entity) throw new NotFoundException();

      const newEntity = this[repoSymbol].merge(
        entity,
        rest as DeepPartial<Entity>,
      );

      return {
        entity: await this[repoSymbol].save(newEntity),
      };
    }

    async softDelete(
      entityId: string | number,
    ): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.findById(entityId);
      if (!entity) throw new NotFoundException();
      return {
        entity: await this[repoSymbol].softRemove(entity),
      };
    }

    async restore(entityId: string | number): Promise<CrudOneResult<Entity>> {
      await this[repoSymbol].restore(entityId);
      return this.findById(entityId);
    }

    async delete(entityId: string | number): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.findById(entityId);
      if (!entity) throw new NotFoundException();
      await this[repoSymbol].remove(entity);
      return { entity: null };
    }

    async setRelation<T = Entity>(
      relationName: string,
      entityId: string | number,
      relatedId?: string | number,
      entityName?: string,
    ): Promise<CrudOneResult<T>> {
      const isInverse = entityName && entityName !== EntityClass.name;
      const inverseEntityName = entityName;
      let relationMetadata: AutoRelationMetadata<any>;
      let repo = this[repoSymbol];

      if (!isInverse) {
        relationMetadata = getOwnedAutoRelation(EntityClass, relationName);

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${EntityClass.name}`,
          );
        }

        if (!['many-to-one', 'one-to-one'].includes(relationMetadata.type)) {
          throw new BadRequestException(
            `Relation ${relationName} must be a one-to-one or many-to-one relation`,
          );
        }

        if (!relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is not owned by Entity ${EntityClass.name}`,
          );
        }
      } else {
        relationMetadata = getOwnedInverseAutoRelation(
          EntityClass,
          relationName,
          inverseEntityName,
        );

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${inverseEntityName}`,
          );
        }

        if (!['one-to-many', 'one-to-one'].includes(relationMetadata.type)) {
          throw new BadRequestException(
            `Relation ${relationName} must be a one-to-many or one-to-one relation`,
          );
        }

        if (relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is owned by Entity ${inverseEntityName}, not by Entity ${EntityClass.name}`,
          );
        }

        repo = this[repoSymbol].manager.getRepository(
          relationMetadata.entity(),
        );
      }

      if (!(await repo.exist({ where: { id: entityId } as any }))) {
        throw new NotFoundException(`Entity with id ${entityId} not found`);
      }

      if (relatedId !== null && relatedId !== undefined) {
        const relatedRepo = this[repoSymbol].manager.getRepository(
          relationMetadata.target(),
        );

        if (!(await relatedRepo.exist({ where: { id: relatedId } as any }))) {
          throw new NotFoundException(
            `Related entity with id ${relatedId} not found`,
          );
        }
      }

      await repo
        .createQueryBuilder()
        .relation(relationMetadata.entity(), relationName)
        .of(entityId)
        .set(relatedId || null);

      return {
        entity: (await repo.findOneBy({ id: entityId } as any)) as T,
      };
    }

    async addRelation<T = Entity>(
      relationName: string,
      entityId: string | number,
      relatedId: string | number,
      entityName?: string,
    ): Promise<CrudOneResult<T>> {
      const isInverse = entityName && entityName !== EntityClass.name;
      const inverseEntityName = entityName;
      let relationMetadata: AutoRelationMetadata<any>;
      let repo = this[repoSymbol];

      if (!isInverse) {
        relationMetadata = getOwnedAutoRelation(EntityClass, relationName);

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${EntityClass.name}`,
          );
        }

        if (!['one-to-many', 'many-to-many'].includes(relationMetadata.type)) {
          throw new BadRequestException(
            `Relation ${relationName} must be a one-to-many or many-to-many relation`,
          );
        }

        if (!relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is not owned by Entity ${EntityClass.name}`,
          );
        }
      } else {
        relationMetadata = getOwnedInverseAutoRelation(
          EntityClass,
          relationName,
          inverseEntityName,
        );

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${inverseEntityName}`,
          );
        }

        if (!['one-to-many', 'many-to-many'].includes(relationMetadata.type)) {
          throw new BadRequestException(
            `Relation ${relationName} must be a one-to-many or many-to-many relation`,
          );
        }

        if (relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is owned by Entity ${inverseEntityName}, not by Entity ${EntityClass.name}`,
          );
        }

        repo = this[repoSymbol].manager.getRepository(
          relationMetadata.entity(),
        );
      }

      if (!(await repo.exist({ where: { id: entityId } as any }))) {
        throw new NotFoundException(`Entity with id ${entityId} not found`);
      }

      const relatedRepo = this[repoSymbol].manager.getRepository(
        relationMetadata.target(),
      );

      if (!(await relatedRepo.exist({ where: { id: relatedId } as any }))) {
        throw new NotFoundException(
          `Related entity with id ${relatedId} not found`,
        );
      }

      await repo
        .createQueryBuilder()
        .relation(relationMetadata.entity(), relationName)
        .of(entityId)
        .add(relatedId);

      return {
        entity: (await repo.findOneBy({
          id: entityId,
        } as any)) as T,
      };
    }

    async removeRelation<T = Entity>(
      relationName: string,
      entityId: string | number,
      relatedId: string | number,
      entityName?: string,
    ): Promise<CrudOneResult<T>> {
      const isInverse = entityName && entityName !== EntityClass.name;
      const inverseEntityName = entityName;
      let relationMetadata: AutoRelationMetadata<any>;
      let repo = this[repoSymbol];

      if (!isInverse) {
        // many-to-many
        relationMetadata = getOwnedAutoRelation(EntityClass, relationName);

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${EntityClass.name}`,
          );
        }

        if (!['one-to-many', 'many-to-many'].includes(relationMetadata.type)) {
          throw new BadRequestException(
            `Relation ${relationName} must be a one-to-many or many-to-many relation`,
          );
        }

        if (!relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is not owned by this entity`,
          );
        }
      } else {
        // many-tom-many owner or one-to-many inversed
        relationMetadata = getOwnedInverseAutoRelation(
          EntityClass,
          relationName,
          inverseEntityName,
        );

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${inverseEntityName}`,
          );
        }

        if (!['one-to-many', 'many-to-many'].includes(relationMetadata.type)) {
          throw new BadRequestException(
            `Relation ${relationName} must be a one-to-many or many-to-many relation`,
          );
        }

        if (relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is owned by Entity ${inverseEntityName}, not by Entity ${EntityClass.name}`,
          );
        }

        repo = this[repoSymbol].manager.getRepository(
          relationMetadata.entity(),
        );
      }

      if (!(await repo.exist({ where: { id: entityId } as any }))) {
        throw new NotFoundException(`Entity with id ${entityId} not found`);
      }

      const relatedRepo = this[repoSymbol].manager.getRepository(
        relationMetadata.target(),
      );

      if (!(await relatedRepo.exist({ where: { id: relatedId } as any }))) {
        throw new NotFoundException(
          `Related entity with id ${relatedId} not found`,
        );
      }

      await repo
        .createQueryBuilder()
        .relation(relationMetadata.entity(), relationName)
        .of(entityId)
        .remove(relatedId);

      return {
        entity: (await repo.findOneBy({
          id: entityId,
        } as any)) as T,
      };
    }

    // TODO: Review query builder performance, try separate owned and inversed logic to avoid switch context
    async findRelation(
      relationName: string,
      entityIds: string[] | number[],
      options?: CrudFindManyType<any>,
      entityName?: string,
    ): Promise<Record<string, CrudManyResult<any>>> {
      if (!Array.isArray(entityIds) || entityIds.length === 0) {
        return {}; // Return empty object if no entityIds provided
      }

      const isInverse = entityName && entityName !== EntityClass.name;
      let ownedRelationMetadata: AutoRelationMetadata<any>;
      let relationMetadata: AutoRelationMetadata<any>;

      if (!isInverse) {
        relationMetadata = getOwnedAutoRelation(EntityClass, relationName);
        ownedRelationMetadata = relationMetadata;

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${EntityClass.name}`,
          );
        }

        if (!relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is not owned by this entity`,
          );
        }
      } else {
        const inverseEntityName = entityName;
        relationMetadata = getOwnedInverseAutoRelation(
          EntityClass,
          relationName,
          inverseEntityName,
        );

        if (!relationMetadata) {
          throw new BadRequestException(
            `Relation ${relationName} not found on Entity ${inverseEntityName}`,
          );
        }

        if (relationMetadata.owner) {
          throw new BadRequestException(
            `Relation ${relationName} is owned by Entity ${inverseEntityName}, not by Entity ${EntityClass.name}`,
          );
        }

        ownedRelationMetadata = retrieveInverseSide(relationMetadata);
      }

      const isManyResults = ['one-to-many', 'many-to-many'].includes(
        relationMetadata.type,
      );

      const filterOptions: FilterOptions<any> = options?.filter || {};

      const sortOptions = options?.sort || {};
      const offsetPaginationOptions = options?.pagination?.offset || {};
      resolveSortandOffsetPaginateOptions(sortOptions, offsetPaginationOptions);

      const targetRepo = this[repoSymbol].manager.getRepository(
        relationMetadata.target(),
      );
      const targetAlias = targetRepo.metadata.targetName;
      const selectQueryBuilders: SelectQueryBuilder<any>[] = [];
      const countQueryBuilders: SelectQueryBuilder<any>[] = [];

      entityIds.forEach((entityId: string | number, index: number) => {
        const selectQueryBuilder = targetRepo.createQueryBuilder(targetAlias);
        const countQueryBuilder = targetRepo.createQueryBuilder(targetAlias);
        const paramName = `id${index}`;

        selectQueryBuilder.addSelect(`:${paramName}`, 'entity_id');

        if (relationMetadata.type === 'many-to-many') {
          const joinTable = typeOrmJoinTable(ownedRelationMetadata);
          const joinColumn = isInverse
            ? joinTable.joinColumn
            : joinTable.inverseJoinColumn;
          const idColumn = isInverse
            ? joinTable.inverseJoinColumn
            : joinTable.joinColumn;
          const joinAlias = `jointable${index}`;

          selectQueryBuilder
            .innerJoin(
              joinTable.name,
              joinAlias,
              `${joinAlias}.${joinColumn} = ${targetAlias}.id`,
            )
            .where(`${joinAlias}.${idColumn} = :${paramName}`, {
              [paramName]: entityId,
            });

          countQueryBuilder
            .innerJoin(
              joinTable.name,
              joinAlias,
              `${joinAlias}.${joinColumn} = ${targetAlias}.id`,
            )
            .where(`${joinAlias}.${idColumn} = :${paramName}`, {
              [paramName]: entityId,
            });
        } else if (isInverse) {
          // Inverse one-to-one & one-to-many
          const joinColumn = typeOrmJoinColumn(ownedRelationMetadata);

          selectQueryBuilder.where(
            `${targetAlias}.${joinColumn} = :${paramName}`,
            {
              [paramName]: entityId,
            },
          );

          countQueryBuilder.where(
            `${targetAlias}.${joinColumn} = :${paramName}`,
            {
              [paramName]: entityId,
            },
          );
        } else {
          // Owner one-to-one & many-to-one
          const joinTable = this[repoSymbol].metadata.targetName;
          const JoinColumn = typeOrmJoinColumn(ownedRelationMetadata);
          const joinAlias = `jointable${index}`;
          selectQueryBuilder.innerJoin(
            joinTable,
            joinAlias,
            `${targetAlias}.id = ${joinAlias}.${JoinColumn}`,
          );
          selectQueryBuilder.where(`${joinAlias}.id = :${paramName}`, {
            [paramName]: entityId,
          });

          countQueryBuilder.innerJoin(
            joinTable,
            joinAlias,
            `${targetAlias}.id = ${joinAlias}.${JoinColumn}`,
          );
          countQueryBuilder.where(`${joinAlias}.id = :${paramName}`, {
            [paramName]: entityId,
          });
        }

        applyFilter(
          selectQueryBuilder,
          targetRepo.metadata,
          filterOptions,
          targetAlias,
        );
        applySort(selectQueryBuilder, sortOptions);
        applyOffsetPaginate(selectQueryBuilder, offsetPaginationOptions);

        applyFilter(
          countQueryBuilder,
          targetRepo.metadata,
          filterOptions,
          targetAlias,
        );

        selectQueryBuilders.push(selectQueryBuilder);

        if (isManyResults) {
          countQueryBuilder.select(`COUNT(${targetAlias}.id)`, 'total_count');
          countQueryBuilder.addSelect(`:${paramName}`, 'entity_id');

          countQueryBuilders.push(countQueryBuilder);
        }
      });

      const countMap: Record<string, number> = {};

      if (isManyResults) {
        const { query: countQuery, parameters: countParameters } =
          buildTypeOrmUnionQuery(countQueryBuilders);
        const countResult = await targetRepo.query(countQuery, countParameters);

        countResult.forEach((row: any) => {
          countMap[row.entity_id] = row.total_count;
        });

        entityIds.forEach((entityId: string | number) => {
          if (!countMap[entityId]) {
            countMap[entityId] = 0;
          }
        });
      }

      const { query: selectQuery, parameters: selectParameters } =
        buildTypeOrmUnionQuery(selectQueryBuilders);

      const queryResult = await targetRepo.query(selectQuery, selectParameters);

      const result = {};

      queryResult.forEach((row: any) => {
        const { entity_id: entityId, ...rest } = row;
        const record = {};

        for (const key of Object.keys(rest)) {
          record[key.replace(`${targetAlias}_`, '')] = row[key];
        }

        if (!result[entityId]) {
          const total = isManyResults ? countMap[entityId] : record ? 1 : 0;

          result[entityId] = {
            entities: [],
            total,
            pages: Math.ceil(total / offsetPaginationOptions.limit),
            page: offsetPaginationOptions.page,
            limit: offsetPaginationOptions.limit,
          };
        }

        result[entityId].entities.push(record);
      });

      entityIds.forEach((entityId: string | number) => {
        if (!result[entityId]) {
          result[entityId] = {
            entities: [],
            total: 0,
            pages: 0,
            page: offsetPaginationOptions.page,
            limit: offsetPaginationOptions.limit,
          };
        }
      });

      return result;
    }
  }

  return TypeOrmCrudService;
}

export function typeOrmJoinColumn(
  ownerMetadata: AutoRelationMetadata<any>,
): string {
  return ownerMetadata.joinColumn || `${ownerMetadata.name}Id`;
}

export function typeOrmJoinTable(
  ownerMetadata: AutoRelationMetadata<any>,
  inverseMetadata?: AutoRelationMetadata<any>,
): AutoRelationJoinTable {
  const joinTable: AutoRelationJoinTable = ownerMetadata.joinTable || {};
  inverseMetadata = inverseMetadata || retrieveInverseSide(ownerMetadata);

  const ownedObjectMetadata = getAutoObjectTypeMetadata(ownerMetadata.entity());
  const inverseObjectMetadata = getAutoObjectTypeMetadata(
    inverseMetadata.entity(),
  );

  joinTable.name =
    joinTable.name ||
    `${ownedObjectMetadata.tableOrCollection}_${ownerMetadata.name}_${inverseObjectMetadata.tableOrCollection}`;

  joinTable.joinColumn =
    joinTable.joinColumn ||
    `${lowerCaseFirstLetter(ownerMetadata.entity().name)}Id`;

  joinTable.inverseJoinColumn =
    joinTable.inverseJoinColumn ||
    `${lowerCaseFirstLetter(inverseMetadata.entity().name)}Id`;

  return joinTable;
}
