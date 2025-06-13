import { CatAddress } from '@app/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatAddressController } from './cat-address.controller';
import { CatAddressService } from './cat-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatAddress])],
  providers: [CatAddressService],
  controllers: [CatAddressController],
  exports: [],
})
export class CatAddressModule {}
