import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Brackets,
  DeepPartial,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import {
  CrudFindManyOptions,
  CrudManyResult,
  CrudOffsetOptions,
  CrudOneResult,
  CrudPaginationOptions,
  CrudQueryService,
  CrudSortOptions,
  FilterOperator,
  FilterOptions,
  WithIdType,
} from '../types';

export async function applyFilter<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity> | WhereExpressionBuilder,
  options: FilterOptions<Dto>,
): Promise<void> {
  options = options || {};
  Object.keys(options).forEach((key) => {
    if (key === 'and') {
      const filters = options[key];
      queryBuilder.andWhere(
        new Brackets((qb) => {
          filters.forEach((filter) => {
            qb.andWhere(
              new Brackets((sqb) => {
                applyFilter(sqb, filter);
              }),
            );
          });
        }),
      );
    } else if (key === 'or') {
      const filters = options[key];
      queryBuilder.andWhere(
        new Brackets((qb) => {
          filters.forEach((filter) => {
            qb.orWhere(
              new Brackets((sqb) => {
                applyFilter(sqb, filter);
              }),
            );
          });
        }),
      );
    } else {
      const operators: FilterOperator<Entity> = options[key];
      Object.keys(operators).forEach((opKey) => {
        const opValue = operators[opKey];
        if (opKey === 'equal') {
          const tempKey = `${key}_${Math.round(Math.random() * 1000)}`;
          queryBuilder.andWhere(`${key} = :${tempKey}`, { [tempKey]: opValue });
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
  queryBuilder.addOrderBy(`${aliasName}.id`, direction);
}

export async function applyOffsetPaginate<Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: CrudOffsetOptions,
): Promise<void> {
  queryBuilder.skip((options.page - 1) * options.limit).take(options.limit);
}

export async function offsetPaginate<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity>,
  filterOptions: FilterOptions<Dto>,
  sortOptions: CrudSortOptions<Dto> = {},
  offsetPaginateOptions: CrudOffsetOptions = {},
): Promise<CrudManyResult<Entity>> {
  applyFilter(queryBuilder, filterOptions);
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

export async function paginate<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity>,
  filterOptions: FilterOptions<Dto>,
  sortOptions: CrudSortOptions<Dto>,
  paginateOptions: CrudPaginationOptions,
): Promise<CrudManyResult<Entity>> {
  sortOptions = sortOptions || {};
  sortOptions.field = sortOptions.field || 'updatedAt';
  sortOptions.direction = sortOptions.direction || 'DESC';
  const offsetPaginateOptions = paginateOptions?.offset || {};
  offsetPaginateOptions.page = offsetPaginateOptions.page || 1;
  offsetPaginateOptions.limit = offsetPaginateOptions.limit || 5;
  return offsetPaginate(
    queryBuilder,
    filterOptions,
    sortOptions,
    offsetPaginateOptions,
  );
}

@Injectable()
export class TypeOrmCrudService<Entity, Dto>
  implements CrudQueryService<Entity, Dto>
{
  constructor(readonly repo: Repository<Entity>) {}

  async create(record: DeepPartial<Dto>): Promise<CrudOneResult<Entity>> {
    return {
      entity: await this.repo.save(record as Entity),
    };
  }

  async find(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const queryBuilder = this.repo.createQueryBuilder();
    for (const field in record) {
      queryBuilder.andWhere(`${field} = :${field}`, { [field]: record[field] });
    }
    return {
      entity: await queryBuilder.getOne(),
    };
  }

  async findMany(
    options: CrudFindManyOptions<Entity>,
  ): Promise<CrudManyResult<Entity>> {
    options = options || {};
    const queryBuilder = this.repo.createQueryBuilder();
    return paginate(
      queryBuilder,
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
    const newEntity = this.repo.merge(
      entity,
      record as unknown as DeepPartial<Entity>,
    );
    return {
      entity: await this.repo.save(newEntity),
    };
  }

  async softDelete(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const { entity } = await this.find(record);
    if (!entity) return { entity };
    return {
      entity: await this.repo.softRemove(entity),
    };
  }

  async restore(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    await this.repo.restore(record.id);
    return this.find(record);
  }

  async delete(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const { entity } = await this.find(record);
    return { entity: await this.repo.remove(entity) };
  }
}
