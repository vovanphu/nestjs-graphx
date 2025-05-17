import { MicroserviceCrudControllerFactory } from '@app/crud';
import { Cat } from '@app/entities';
import { Controller } from '@nestjs/common';
import { CatManagementService } from './cat-management.service';

@Controller()
export class CatManagementController extends MicroserviceCrudControllerFactory(
  Cat,
  CatManagementService,
) {}
