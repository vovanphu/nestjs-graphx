import { CatAddress } from '@app/entities';
import { CrudProxyServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatAddressService extends CrudProxyServiceFactory(
  CatAddress,
  'CAT_MANAGEMENT',
) {}
