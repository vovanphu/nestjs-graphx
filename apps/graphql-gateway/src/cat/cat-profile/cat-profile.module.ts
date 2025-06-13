import { Module } from '@nestjs/common';
import { CatProfileResolver } from './cat-profile.resolver';
import { CatProfileService } from './cat-profile.service';

@Module({
  imports: [],
  providers: [CatProfileService, CatProfileResolver],
  controllers: [],
  exports: [CatProfileService],
})
export class CatProfileModule {}
