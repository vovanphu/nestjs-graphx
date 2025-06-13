import {
  AutoField,
  AutoObjectType,
  AutoRelation,
  BaseEntityObject,
} from '@app/graphx';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { CatAddress } from './cat-address.entity';
import { CatGroup } from './cat-group.entity';
import { CatProfile } from './cat-profile.entity';

@AutoObjectType()
@Entity()
export class Cat extends BaseEntityObject<Cat> {
  @AutoField({ typeFn: () => String, viewPolicy: ['create', 'read'] })
  @Column({ unique: true })
  catname: string;

  @AutoField({ typeFn: () => String })
  @Column({ unique: true })
  catmail: string;

  @AutoField({ typeFn: () => String, viewPolicy: ['create', 'update'] })
  @Column()
  catword: string;

  @AutoRelation({
    target: () => CatProfile,
    type: 'one-to-one',
    inverseSide: (profile) => profile.cat,
  })
  @OneToOne(() => CatProfile, (profile) => profile.cat)
  profile: CatProfile;

  @AutoRelation({
    target: () => CatAddress,
    type: 'one-to-many',
    inverseSide: (address) => address.cat,
  })
  @OneToMany(() => CatAddress, (address) => address.cat)
  addresses: CatAddress[];

  @AutoRelation({
    target: () => CatGroup,
    type: 'many-to-many',
    inverseSide: (group) => group.cats,
  })
  @ManyToMany(() => CatGroup, (group) => group.cats)
  groups: [CatGroup];
}
