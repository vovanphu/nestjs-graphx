import { AutoField, BaseEntity } from '@app/crud';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserProfile extends BaseEntity<UserProfile> {
  @AutoField({ typeFn: () => String })
  @Column()
  firstName: string;

  @AutoField({ typeFn: () => String })
  @Column()
  lastName: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
