import { AutoField, BaseEntity } from '@app/crud';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User extends BaseEntity<User> {
  @AutoField({ typeFn: () => String, viewPolicy: ['create', 'read'] })
  @Column({ unique: true })
  username: string;

  @AutoField({ typeFn: () => String })
  @Column({ unique: true })
  email: string;

  @AutoField({ typeFn: () => String, viewPolicy: ['create', 'update'] })
  @Column()
  password: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;
}
