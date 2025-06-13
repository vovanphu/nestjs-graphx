/*
Author: Phu Vo (vovanphu1012@gmail.com)
graphql-inputs.ts (c) 2025
*/

import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StringFilterOptions {
  @Field(() => String, { nullable: true })
  equal?: string;

  @Field(() => String, { nullable: true })
  like?: string;

  @Field(() => String, { nullable: true })
  notLike?: string;

  @Field(() => Boolean, { nullable: true })
  empty?: boolean;

  @Field(() => Boolean, { nullable: true })
  notEmpty?: boolean;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];
}

@InputType()
export class IDFilterOptions {
  @Field(() => ID, { nullable: true })
  equal?: string;

  @Field(() => [ID], { nullable: true })
  in?: string[];
}

@InputType()
export class BooleanFilterOptions {
  @Field(() => Boolean, { nullable: true })
  is?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNot?: boolean;
}

@InputType()
export class IntFilterOptions {
  @Field(() => Int, { nullable: true })
  equal?: number;

  @Field(() => Int, { nullable: true })
  greater?: number;

  @Field(() => Int, { nullable: true })
  greaterOrEqual?: number;

  @Field(() => Int, { nullable: true })
  lesser?: number;

  @Field(() => Int, { nullable: true })
  lesserOrEqual?: number;

  @Field(() => Boolean, { nullable: true })
  empty?: boolean;

  @Field(() => Boolean, { nullable: true })
  notEmpty?: boolean;

  @Field(() => [Int], { nullable: true })
  in?: string[];

  @Field(() => [Int], { nullable: true })
  notIn?: string[];
}

@InputType()
export class FloatFilterOptions {
  @Field(() => Float, { nullable: true })
  equal?: number;

  @Field(() => Float, { nullable: true })
  greater?: number;

  @Field(() => Float, { nullable: true })
  greaterOrEqual?: number;

  @Field(() => Float, { nullable: true })
  lesser?: number;

  @Field(() => Float, { nullable: true })
  lesserOrEqual?: number;

  @Field(() => Boolean, { nullable: true })
  empty?: boolean;

  @Field(() => Boolean, { nullable: true })
  notEmpty?: boolean;

  @Field(() => [Float], { nullable: true })
  in?: string[];

  @Field(() => [Float], { nullable: true })
  notIn?: string[];
}

@InputType()
export class DateFilterOptions {
  @Field(() => String, { nullable: true })
  equal?: Date;

  @Field(() => String, { nullable: true })
  greater?: Date;

  @Field(() => String, { nullable: true })
  greaterOrEqual?: Date;

  @Field(() => String, { nullable: true })
  lesser?: Date;

  @Field(() => String, { nullable: true })
  lesserOrEqual?: Date;

  @Field(() => Boolean, { nullable: true })
  empty?: boolean;

  @Field(() => Boolean, { nullable: true })
  notEmpty?: boolean;
}
