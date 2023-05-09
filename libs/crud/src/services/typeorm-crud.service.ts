import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import {
  CrudFindManyOptions,
  CrudManyResult,
  CrudOffsetOptions,
  CrudOneResult,
  CrudQueryService,
  CrudSortOptions,
  WithIdType,
} from '../types';

export async function applySort<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: CrudSortOptions<Dto>,
): Promise<void> {
  const aliasName = queryBuilder.expressionMap.mainAlias.name;
  queryBuilder.addOrderBy(
    `${aliasName}.${String(options.field)}`,
    options.direction,
  );
  queryBuilder.addOrderBy(`${aliasName}.id`, options.direction);
}

export async function applyOffsetPaginate<Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  options: CrudOffsetOptions,
): Promise<void> {
  queryBuilder.skip((options.page - 1) * options.limit).take(options.limit);
}

export async function paginate<Entity, Dto>(
  queryBuilder: SelectQueryBuilder<Entity>,
  sortOptions: CrudSortOptions<Dto> = {},
  paginateOptions: CrudOffsetOptions = {},
): Promise<CrudManyResult<Entity>> {
  sortOptions.field = sortOptions.field || 'updatedAt';
  sortOptions.direction = sortOptions.direction || 'DESC';
  paginateOptions.page = paginateOptions.page || 1;
  paginateOptions.limit = paginateOptions.limit || 5;
  const total: number = await queryBuilder.getCount();
  applySort(queryBuilder, sortOptions);
  applyOffsetPaginate(queryBuilder, paginateOptions);
  return {
    entities: await queryBuilder.getMany(),
    total,
    pages: Math.ceil(total / paginateOptions.limit),
    page: paginateOptions.page,
    limit: paginateOptions.limit,
  };
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
    options.sort = options.sort || {};
    options.pagination = options.pagination || {};
    const queryBuilder = this.repo.createQueryBuilder();
    return paginate(queryBuilder, options.sort, options.pagination.offset);
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
