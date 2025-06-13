import { Module } from '@nestjs/common';
import { CatAddressModule } from './cat-address';
import { CatGroupModule } from './cat-group';
import { CatProfileModule } from './cat-profile';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';

@Module({
  imports: [CatProfileModule, CatAddressModule, CatGroupModule],
  providers: [CatService, CatResolver],
  exports: [CatService],
})
export class CatModule {}
