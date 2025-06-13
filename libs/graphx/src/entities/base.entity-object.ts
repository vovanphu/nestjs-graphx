/*
Author: Phu Vo (vovanphu1012@gmail.com)
base.entity-object.ts (c) 2025
*/

import { SerializeOptions } from '@nestjs/common';
import { ID } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoField, AutoObjectType } from '../decorators';

@AutoObjectType()
@Entity()
@SerializeOptions({
  excludePrefixes: ['_'],
})
export class BaseEntityObject<T> {
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
