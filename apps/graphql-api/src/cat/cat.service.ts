import { CrudProxyServiceFactory } from '@app/crud';
import { Cat } from '@app/entities';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CatService extends CrudProxyServiceFactory(Cat) {
  constructor(@Inject('CAT_MANAGEMENT') readonly client: ClientProxy) {
    super(client);
  }
}
