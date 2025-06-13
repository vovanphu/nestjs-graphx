import { Cat } from '@app/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatAddressModule } from './cat-address';
import { CatGroupModule } from './cat-group';
import { CatProfileModule } from './cat-profile';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat]),
    CatProfileModule,
    CatAddressModule,
    CatGroupModule,
  ],
  providers: [CatService],
  controllers: [CatController],
  exports: [],
})
export class CatModule {}
