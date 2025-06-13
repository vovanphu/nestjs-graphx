/*
Author: Phu Vo (vovanphu1012@gmail.com)
microservice.controller.factory.ts (c) 2025
*/

import {
  getOwnedAutoRelations,
  getOwnedInverseAutoRelations,
} from '../decorators';
import { ClassType } from '../types';
import { createMicroserviceCrudController } from './microservice-crud.controller';
import { createMicroserviceRelationControllers } from './microservice-relation.controller';

export function MicroserviceControllerFactory<Entity>(
  EntityClass: ClassType<Entity>,
  ProviderClass: ClassType<any>,
) {
  const MicroserviceCrudController = createMicroserviceCrudController(
    EntityClass,
    ProviderClass,
  );

  const ownedAutoRelations = getOwnedAutoRelations(EntityClass);

  const MicroserviceOwnedRelationsController =
    createMicroserviceRelationControllers(
      EntityClass,
      ProviderClass,
      ownedAutoRelations,
      MicroserviceCrudController,
    );

  const ownedInverseAutoRelations = getOwnedInverseAutoRelations(EntityClass);

  const MicroserviceOwnedInverseRelationsController =
    createMicroserviceRelationControllers(
      EntityClass,
      ProviderClass,
      ownedInverseAutoRelations,
      MicroserviceOwnedRelationsController,
    );

  return MicroserviceOwnedInverseRelationsController;
}
