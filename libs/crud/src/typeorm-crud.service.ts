import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import {
  CrudFindOptions,
  CrudManyResult,
  CrudOffsetOptions,
  CrudOneResult,
  CrudQueryService,
  CrudSortOptions,
  WithIdType,
} from './types';

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

export async function offsetPaginate<Entity, Dto>(
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

  async createOne(record: DeepPartial<Dto>): Promise<CrudOneResult<Entity>> {
    return {
      entity: await this.repo.save(record as Entity),
    };
  }

  async findOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const queryBuilder = this.repo.createQueryBuilder();
    queryBuilder.andWhere('id = :id', { id: record.id });
    return {
      entity: await queryBuilder.getOne(),
    };
  }

  async findMany(
    options: CrudFindOptions<Entity>,
  ): Promise<CrudManyResult<Entity>> {
    options = options || {};
    options.sort = options.sort || {};
    options.pagination = options.pagination || {};
    const queryBuilder = this.repo.createQueryBuilder();
    return offsetPaginate(
      queryBuilder,
      options.sort,
      options.pagination.offset,
    );
  }

  async updateOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const { entity } = await this.findOne(record);
    if (!entity) throw new NotFoundException();
    const newEntity = this.repo.merge(
      entity,
      record as unknown as DeepPartial<Entity>,
    );
    return {
      entity: await this.repo.save(newEntity),
    };
  }

  async softDeleteOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const { entity } = await this.findOne(record);
    if (!entity) return { entity };
    return {
      entity: await this.repo.softRemove(entity),
    };
  }

  async restoreOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    await this.repo.restore(record.id);
    return this.findOne(record);
  }

  async deleteOne(
    record: WithIdType<DeepPartial<Dto>>,
  ): Promise<CrudOneResult<Entity>> {
    const { entity } = await this.findOne(record);
    return { entity: await this.repo.remove(entity) };
  }
}
