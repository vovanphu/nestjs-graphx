import { Cat } from '@app/entities';
import { CrudProxyServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService extends CrudProxyServiceFactory(
  Cat,
  'CAT_MANAGEMENT',
) {}
