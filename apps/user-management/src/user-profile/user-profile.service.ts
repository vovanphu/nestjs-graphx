import { TypeOrmCrudServiceFactory } from '@app/crud';
import { UserProfile } from '@app/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserProfileService extends TypeOrmCrudServiceFactory(
  UserProfile,
) {}
