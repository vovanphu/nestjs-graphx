import { CrudProxyServiceFactory } from '@app/crud';
import { UserProfile } from '@app/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserProfileService extends CrudProxyServiceFactory(UserProfile) {
  constructor(@Inject('USER_MANAGEMENT') readonly client: ClientProxy) {
    super(client);
  }
}
