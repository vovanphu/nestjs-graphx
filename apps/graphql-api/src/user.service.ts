import { ClientCrudService } from '@app/crud';
import { UserEntity } from '@app/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService extends ClientCrudService(UserEntity) {
  constructor(@Inject('USER_MANAGEMENT') readonly client: ClientProxy) {
    super(client);
  }
}
