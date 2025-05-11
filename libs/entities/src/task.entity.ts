import { BaseDto, BaseEntity } from '@app/crud';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Task extends BaseEntity<Task> {
  @Field(() => String)
  @Column()
  title: string;
}

@InputType()
export class TaskDto extends BaseDto<TaskDto> {
  @Field(() => String)
  title: string;
}
