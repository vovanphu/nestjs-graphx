/*
Author: Phu Vo (vovanphu1012@gmail.com)
filter-types.ts (c) 2025
*/

export type StringFilterOperator = {
  equal?: string;
  like?: string;
  notLike?: string;
  empty?: boolean;
  notEmpty?: boolean;
  in?: string[];
  notIn?: string[];
};

export type BooleanFilterOperator = {
  is?: boolean;
  isNot?: boolean;
};

export type NumberFilterOperator = {
  equal?: number;
  greater?: number;
  greaterOrEqual?: number;
  lesser?: number;
  lesserOrEqual?: number;
  empty?: boolean;
  notEmpty?: boolean;
  in?: string[];
  notIn?: string[];
};

export type DateFilterOperator = {
  equal?: Date;
  greater?: Date;
  greaterOrEqual?: Date;
  lesser?: Date;
  lesserOrEqual?: Date;
  empty?: boolean;
  notEmpty?: boolean;
};

export type FilterGroup<Entity> = {
  and?: FilterOptions<Entity>[];
  or?: FilterOptions<Entity>[];
};

export type FilterOperator<Entity> = {
  [Field in keyof Entity]?: FieldFilterOperator<Entity[Field]>;
};

export type FieldFilterOperator<Type> = Type extends string
  ? StringFilterOperator
  : Type extends boolean
  ? BooleanFilterOperator
  : Type extends Date
  ? DateFilterOperator
  : never;

export type FilterOptions<Entity> = FilterGroup<Entity> &
  FilterOperator<Entity>;
