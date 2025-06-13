import { CatProfile } from '@app/entities';
import { CrudProxyServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatProfileService extends CrudProxyServiceFactory(
  CatProfile,
  'CAT_MANAGEMENT',
) {}
