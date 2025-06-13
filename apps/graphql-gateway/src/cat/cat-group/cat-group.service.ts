import { CatGroup } from '@app/entities';
import { CrudProxyServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatGroupService extends CrudProxyServiceFactory(
  CatGroup,
  'CAT_MANAGEMENT',
) {}
