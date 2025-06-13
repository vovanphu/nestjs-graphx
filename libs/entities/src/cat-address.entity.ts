import {
  AutoField,
  AutoObjectType,
  AutoRelation,
  BaseEntityObject,
} from '@app/graphx';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Cat } from './cat.entity';

@AutoObjectType()
@Entity()
export class CatAddress extends BaseEntityObject<CatAddress> {
  @AutoField({ typeFn: () => String })
  @Column()
  street: string;

  @AutoField({ typeFn: () => String })
  @Column()
  city: string;

  @AutoField({ typeFn: () => String })
  @Column()
  state: string;

  @AutoField({ typeFn: () => String })
  @Column()
  postalCode: string;

  @AutoField({ typeFn: () => String })
  @Column()
  country: string;

  @AutoRelation({
    target: () => Cat,
    type: 'many-to-one',
    owner: true,
  })
  @ManyToOne(() => Cat)
  @JoinColumn()
  cat: Cat;
}
