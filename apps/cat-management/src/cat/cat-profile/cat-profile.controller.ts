import { CatProfile } from '@app/entities';
import { MicroserviceControllerFactory } from '@app/graphx';
import { Controller } from '@nestjs/common';
import { CatProfileService } from './cat-profile.service';

@Controller()
export class CatProfileController extends MicroserviceControllerFactory(
  CatProfile,
  CatProfileService,
) {}
