import { Module } from '@nestjs/common';
import { UserProfileModule } from './user-profile';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [UserProfileModule],
  providers: [UserService, UserResolver],
  exports: [],
})
export class UserModule {}
