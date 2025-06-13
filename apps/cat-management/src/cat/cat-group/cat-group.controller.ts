import { CatGroup } from '@app/entities';
import { MicroserviceControllerFactory } from '@app/graphx';
import { Controller } from '@nestjs/common';
import { CatGroupService } from './cat-group.service';

@Controller()
export class CatGroupController extends MicroserviceControllerFactory(
  CatGroup,
  CatGroupService,
) {}
