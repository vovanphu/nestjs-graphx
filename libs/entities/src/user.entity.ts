import { NodeEntity, NodeInput } from '@app/crud';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class UserEntity extends NodeEntity<UserEntity> {
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
