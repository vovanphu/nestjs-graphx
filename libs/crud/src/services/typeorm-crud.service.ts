import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ClassConstructor,
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
  FilterOperator,
  FilterOptions,
  IdentifyType,
} from '../types';

export async function applyFilter<Entity>(
  queryBuilder: SelectQueryBuilder<Entity> | WhereExpressionBuilder,
  metadata: EntityMetadata,
  options: FilterOptions<Entity>,
): Promise<void> {
  options = options || {};
  Object.keys(options).forEach((key) => {
    const tempKey = `${key}_${Math.round(Math.random() * 10000)}`;
    const operators: FilterOperator<Entity> = options[key] || {};
    const column: ColumnMetadata = metadata.columns.find(
      (column) => column.propertyName === key,
    );

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
          queryBuilder.andWhere(`${key} = :${tempKey}`, { [tempKey]: opValue });
        } else if (opKey === 'greater') {
          queryBuilder.andWhere(`${key} > :${tempKey}`, { [tempKey]: opValue });
        } else if (opKey === 'greaterOrEqual') {
          queryBuilder.andWhere(`${key} >= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesser') {
          queryBuilder.andWhere(`${key} < :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesserOrEqual') {
          queryBuilder.andWhere(`${key} <= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'empty' && opValue) {
          queryBuilder.andWhere(`${key} IS NULL`);
        } else if (opKey === 'notEmpty' && opValue) {
          queryBuilder.andWhere(`${key} IS NOT NULL`);
        } else if (opKey === 'in') {
          queryBuilder.andWhere(`${key} IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'notIn') {
          queryBuilder.andWhere(`${key} NOT IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        }
      });
    } else if (column.type === Boolean) {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'is') {
          queryBuilder.andWhere(`${key} = :${tempKey}`, { [tempKey]: opValue });
        } else if (opKey === 'isNot') {
          queryBuilder.andWhere(`${key} <> :${tempKey}`, {
            [tempKey]: opValue,
          });
        }
      });
    } else if (column.type === String) {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'equal') {
          queryBuilder.andWhere(`${key} = :${tempKey}`, { [tempKey]: opValue });
        } else if (opKey === 'like') {
          queryBuilder.andWhere(`${key} LIKE :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'notLike') {
          queryBuilder.andWhere(`${key} NOT LIKE :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'empty' && opValue) {
          queryBuilder.andWhere(`${key} IS NULL`);
        } else if (opKey === 'notEmpty' && opValue) {
          queryBuilder.andWhere(`${key} IS NOT NULL`);
        } else if (opKey === 'in') {
          queryBuilder.andWhere(`${key} IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'notIn') {
          queryBuilder.andWhere(`${key} NOT IN (:...${tempKey})`, {
            [tempKey]: opValue,
          });
        }
      });
    } else if (column.type === 'datetime') {
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'equal') {
          queryBuilder.andWhere(`DATE(${key}) = :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'greater') {
          queryBuilder.andWhere(`DATE(${key}) > :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'greaterOrEqual') {
          queryBuilder.andWhere(`DATE(${key}) >= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesser') {
          queryBuilder.andWhere(`DATE(${key}) < :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'lesserOrEqual') {
          queryBuilder.andWhere(`DATE(${key}) <= :${tempKey}`, {
            [tempKey]: opValue,
          });
        } else if (opKey === 'empty' && opValue) {
          queryBuilder.andWhere(`${key} IS NULL`);
        } else if (opKey === 'notEmpty' && opValue) {
          if (
            column.isDeleteDate &&
            queryBuilder instanceof SelectQueryBuilder
          ) {
            queryBuilder.withDeleted();
          }
          queryBuilder.andWhere(`${key} IS NOT NULL`);
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

export async function queryAndPaginate<Entity>(
  repo: Repository<Entity>,
  filterOptions: FilterOptions<Entity>,
  sortOptions: CrudSortOptions<Entity>,
  paginateOptions: CrudPaginationOptions,
): Promise<CrudManyResult<Entity>> {
  // This function just provide default values
  sortOptions = sortOptions || {};
  sortOptions.field = sortOptions.field || 'updatedAt';
  sortOptions.direction = sortOptions.direction || 'DESC';
  const offsetPaginateOptions = paginateOptions?.offset || {};
  offsetPaginateOptions.page = offsetPaginateOptions.page || 1;
  offsetPaginateOptions.limit = offsetPaginateOptions.limit || 5;

  return offsetPaginate(
    repo,
    filterOptions,
    sortOptions,
    offsetPaginateOptions,
  );
}

export function TypeOrmCrudServiceFactory<Entity extends ClassConstructor<any>>(
  EntityClass: Entity,
): ClassConstructor<CrudQueryInterface<Entity>> {
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

    async findById(
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      return {
        entity: await this[repoSymbol].findOneBy({ id: record.id } as any),
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
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.findById(record);
      if (!entity) throw new NotFoundException();
      return {
        entity: await this[repoSymbol].softRemove(entity),
      };
    }

    async restore(
      record: IdentifyType<Entity>,
    ): Promise<CrudOneResult<Entity>> {
      await this[repoSymbol].restore(record.id);
      return this.find(record);
    }

    async delete(record: IdentifyType<Entity>): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.findById(record);
      if (!entity) throw new NotFoundException();
      await this[repoSymbol].remove(entity);
      return { entity: null };
    }
  }

  return TypeOrmCrudService;
}
