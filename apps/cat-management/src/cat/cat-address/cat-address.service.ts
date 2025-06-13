import { CatAddress } from '@app/entities';
import { TypeOrmCrudServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatAddressService extends TypeOrmCrudServiceFactory(CatAddress) {}
