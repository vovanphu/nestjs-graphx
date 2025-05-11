import { MicroserviceCrudControllerFactory } from '@app/crud';
import { User } from '@app/entities';
import { Controller } from '@nestjs/common';
import { UserManagementService } from './user-management.service';

@Controller()
export class UserManagementController extends MicroserviceCrudControllerFactory(
  User,
) {
  constructor(readonly userManagementService: UserManagementService) {
    super(userManagementService);
  }
}
