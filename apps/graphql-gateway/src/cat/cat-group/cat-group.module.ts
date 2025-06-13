import { Module } from '@nestjs/common';
import { CatGroupResolver } from './cat-group.resolver';
import { CatGroupService } from './cat-group.service';

@Module({
  imports: [],
  providers: [CatGroupService, CatGroupResolver],
  controllers: [],
  exports: [CatGroupService],
})
export class CatGroupModule {}
