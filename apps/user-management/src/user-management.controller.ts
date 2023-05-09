import { MicroserviceCrudController } from '@app/crud';
import { User } from '@app/entities';
import { Controller } from '@nestjs/common';
import { UserManagementService } from './user-management.service';

@Controller()
export class UserManagementController extends MicroserviceCrudController(User) {
  constructor(private readonly userManagementService: UserManagementService) {
    super(userManagementService);
  }
}
