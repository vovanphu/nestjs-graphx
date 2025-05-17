import { MicroserviceCrudControllerFactory } from '@app/crud';
import { UserProfile } from '@app/entities';
import { Controller } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';

@Controller()
export class UserProfileController extends MicroserviceCrudControllerFactory(
  UserProfile,
  UserProfileService,
) {}
