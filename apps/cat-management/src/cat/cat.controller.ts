import { Cat } from '@app/entities';
import { MicroserviceControllerFactory } from '@app/graphx';
import { Controller } from '@nestjs/common';
import { CatService } from './cat.service';

@Controller()
export class CatController extends MicroserviceControllerFactory(
  Cat,
  CatService,
) {}
