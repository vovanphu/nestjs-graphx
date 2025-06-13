import { AutoField, AutoObjectType, BaseEntityObject } from '@app/graphx';
import { AutoRelation } from '@app/graphx/decorators/auto-relation.decorator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Cat } from './cat.entity';

@AutoObjectType()
@Entity()
export class CatProfile extends BaseEntityObject<CatProfile> {
  @AutoField({ typeFn: () => String })
  @Column()
  firstName: string;

  @AutoField({ typeFn: () => String })
  @Column()
  lastName: string;

  @AutoRelation({
    target: () => Cat,
    type: 'one-to-one',
    owner: true,
  })
  @OneToOne(() => Cat)
  @JoinColumn()
  cat: Cat;
}
