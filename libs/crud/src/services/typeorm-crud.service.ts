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
  ClassType,
  CrudFindManyOptions,
  CrudManyResult,
  CrudOffsetOptions,
  CrudOneResult,
  CrudPaginationOptions,
  CrudQueryInterface,
  CrudSortOptions,
  FilterOperator,
  FilterOptions,
  WithIdType,
} from '../types';

export async function applyFilter<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity> | WhereExpressionBuilder,
  metadata: EntityMetadata,
  options: FilterOptions<Dto>, // # TODO Check this, why didn't use <Entity> for simplicity
): Promise<void> {
  options = options || {};
  Object.keys(options).forEach((key) => {
    const tempKey = `${key}_${Math.round(Math.random() * 1000)}`; // # TODO Is this okay to random from 1 to 1000
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

export async function applySort<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: CrudSortOptions<Dto>,
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

export async function offsetPaginate<Entity, Dto>( // # TODO Check its name, this function does more than just offset paginate
  repo: Repository<Entity>,
  filterOptions: FilterOptions<Dto>,
  sortOptions: CrudSortOptions<Dto> = {},
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

export async function paginate<Entity, Dto>( // # TODO Check its name, why we need to call another function here?
  repo: Repository<Entity>,
  filterOptions: FilterOptions<Dto>,
  sortOptions: CrudSortOptions<Dto>,
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

export function TypeOrmCrudServiceFactory<Entity>(
  EntityClass: ClassType<Entity>,
): ClassType<CrudQueryInterface<Entity, any>> {
  const dataSourceSymbol = Symbol(`DataSource${EntityClass.name}`);
  const repoSymbol = Symbol(`Repository${EntityClass.name}`);

  @Injectable()
  class TypeOrmCrudService<Entity, Dto>
    implements CrudQueryInterface<Entity, Dto>
  {
    @Inject(DataSource) readonly [dataSourceSymbol]: DataSource;
    @InjectRepository(EntityClass) readonly [repoSymbol]: Repository<Entity>;

    async create(record: DeepPartial<Dto>): Promise<CrudOneResult<Entity>> {
      return {
        entity: await this[repoSymbol].save(record as Entity),
      };
    }

    async find(
      record: WithIdType<DeepPartial<Dto>>,
    ): Promise<CrudOneResult<Entity>> {
      const queryBuilder = this[repoSymbol].createQueryBuilder();
      for (const field in record) {
        queryBuilder.andWhere(`${field} = :${field}`, {
          [field]: record[field],
        });
      }
      return {
        entity: await queryBuilder.getOne(),
      };
    }

    async findMany(
      options: CrudFindManyOptions<Entity>,
    ): Promise<CrudManyResult<Entity>> {
      options = options || {};
      return paginate(
        this[repoSymbol],
        options?.filter,
        options?.sort,
        options?.pagination,
      );
    }

    async update(
      record: WithIdType<DeepPartial<Dto>>,
    ): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.find(record);
      if (!entity) throw new NotFoundException();
      const newEntity = this[repoSymbol].merge(
        entity,
        record as unknown as DeepPartial<Entity>,
      );
      return {
        entity: await this[repoSymbol].save(newEntity),
      };
    }

    async softDelete(
      record: WithIdType<DeepPartial<Dto>>,
    ): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.find(record);
      if (!entity) return { entity }; // # TODO Should we throw error here?
      return {
        entity: await this[repoSymbol].softRemove(entity),
      };
    }

    async restore(
      record: WithIdType<DeepPartial<Dto>>,
    ): Promise<CrudOneResult<Entity>> {
      await this[repoSymbol].restore(record.id);
      return this.find(record);
    }

    async delete(
      record: WithIdType<DeepPartial<Dto>>,
    ): Promise<CrudOneResult<Entity>> {
      const { entity } = await this.find(record);
      return { entity: await this[repoSymbol].remove(entity) };
    }
  }

  return TypeOrmCrudService;
}
