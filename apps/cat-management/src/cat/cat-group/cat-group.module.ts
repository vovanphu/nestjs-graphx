import { CatGroup } from '@app/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatGroupController } from './cat-group.controller';
import { CatGroupService } from './cat-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatGroup])],
  providers: [CatGroupService],
  controllers: [CatGroupController],
  exports: [],
})
export class CatGroupModule {}
