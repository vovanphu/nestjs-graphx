import { AutoField, BaseEntity } from '@app/crud';
import { Column, Entity } from 'typeorm';

@Entity()
export class Cat extends BaseEntity<Cat> {
  @AutoField({ typeFn: () => String })
  @Column()
  name: string;
}
