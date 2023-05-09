import { ClientCrudService } from '@app/crud';
import { User } from '@app/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService extends ClientCrudService(User) {
  constructor(@Inject('USER_MANAGEMENT') readonly client: ClientProxy) {
    super(client);
  }
}
