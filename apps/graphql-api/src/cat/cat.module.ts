import { Module } from '@nestjs/common';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';

@Module({
  providers: [CatService, CatResolver],
  exports: [],
})
export class CatModule {}
