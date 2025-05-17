import { CrudManyResult, CrudOneResult } from './crud-result';
import {
  CrudCreateType,
  CrudFindManyType,
  CrudFindType,
  CrudUpdateType,
  IdentifyType,
} from './crud-types';

export interface CrudQueryInterface<ObjectType, InputType = ObjectType> {
  create(record: CrudCreateType<InputType>): Promise<CrudOneResult<ObjectType>>;

  find(record: CrudFindType<ObjectType>): Promise<CrudOneResult<ObjectType>>;

  findById(
    record: IdentifyType<ObjectType>,
  ): Promise<CrudOneResult<ObjectType>>;

  findMany(
    options: CrudFindManyType<ObjectType>,
  ): Promise<CrudManyResult<ObjectType>>;

  update(record: CrudUpdateType<InputType>): Promise<CrudOneResult<ObjectType>>;

  softDelete?(
    record: IdentifyType<ObjectType>,
  ): Promise<CrudOneResult<ObjectType>>;

  restore?(
    record: IdentifyType<ObjectType>,
  ): Promise<CrudOneResult<ObjectType>>;

  delete(record: IdentifyType<ObjectType>): Promise<CrudOneResult<ObjectType>>;
}
