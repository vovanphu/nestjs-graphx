import { TypeOrmCrudServiceFactory } from '@app/crud';
import { User } from '@app/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserManagementService extends TypeOrmCrudServiceFactory(User) {}
