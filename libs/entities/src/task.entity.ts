import { NodeEntity, NodeInput } from '@app/crud';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Task extends NodeEntity<Task> {
  @Field(() => String)
  @Column()
  title: string;
}

@InputType()
export class TaskDto extends NodeInput<TaskDto> {
  @Field(() => String)
  title: string;
}
