import { SerializeOptions } from '@nestjs/common';
import { Field, ID, InputType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoField } from './decorators';

@Entity()
@SerializeOptions({
  excludePrefixes: ['_'],
})
export class BaseEntity<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @AutoField({ typeFn: () => ID, viewPolicy: ['read', 'update'] })
  @PrimaryGeneratedColumn()
  id: string;

  @AutoField({ typeFn: () => String, viewPolicy: ['read'] })
  @CreateDateColumn()
  createdAt: Date;

  @AutoField({ typeFn: () => String, viewPolicy: ['read'] })
  @UpdateDateColumn()
  updatedAt: Date;

  @AutoField({
    typeFn: () => String,
    fieldOptions: { nullable: true },
    viewPolicy: ['read'],
  })
  @DeleteDateColumn()
  deletedAt?: Date;
}

@InputType()
export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @Field(() => ID)
  id: string;
}
