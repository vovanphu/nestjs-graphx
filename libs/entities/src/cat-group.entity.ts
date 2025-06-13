import {
  AutoField,
  AutoObjectType,
  AutoRelation,
  BaseEntityObject,
} from '@app/graphx';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Cat } from './cat.entity';

@AutoObjectType()
@Entity()
export class CatGroup extends BaseEntityObject<CatGroup> {
  @AutoField({ typeFn: () => String })
  @Column()
  name: string;

  @AutoRelation({
    target: () => Cat,
    type: 'many-to-many',
    owner: true,
  })
  @ManyToMany(() => Cat, (cat) => cat.groups)
  @JoinTable()
  cats: [Cat];
}
