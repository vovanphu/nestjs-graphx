import { NodeEntity, NodeInput } from '@app/crud';
import { OneManyRelation } from '@app/crud/relation';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Task, TaskDto } from './task.entity';

@ObjectType()
@OneManyRelation(Task, TaskDto, 'tasks', (task) => task.userId)
@Entity()
export class User extends NodeEntity<User> {
  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}

@InputType()
export class UserDto extends NodeInput<UserDto> {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
