import { Module } from '@nestjs/common';
import { UserProfileResolver } from './user-profile.resolver';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [],
  providers: [UserProfileService, UserProfileResolver],
  exports: [],
  controllers: [],
})
export class UserProfileModule {}
