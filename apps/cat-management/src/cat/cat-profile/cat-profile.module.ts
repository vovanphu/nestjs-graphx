import { CatProfile } from '@app/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatProfileController } from './cat-profile.controller';
import { CatProfileService } from './cat-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatProfile])],
  providers: [CatProfileService],
  controllers: [CatProfileController],
  exports: [],
})
export class CatProfileModule {}
