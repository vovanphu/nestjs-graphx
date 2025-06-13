import { CatAddress } from '@app/entities';
import { MicroserviceControllerFactory } from '@app/graphx';
import { Controller } from '@nestjs/common';
import { CatAddressService } from './cat-address.service';

@Controller()
export class CatAddressController extends MicroserviceControllerFactory(
  CatAddress,
  CatAddressService,
) {}
