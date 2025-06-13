import { Module } from '@nestjs/common';
import { CatAddressResolver } from './cat-address.resolver';
import { CatAddressService } from './cat-address.service';

@Module({
  imports: [],
  providers: [CatAddressService, CatAddressResolver],
  controllers: [],
  exports: [CatAddressService],
})
export class CatAddressModule {}
