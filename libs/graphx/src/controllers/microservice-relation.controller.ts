/*
Author: Phu Vo (vovanphu1012@gmail.com)
microservice-relation.controller.ts (c) 2025
*/

import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AutoRelationMetadata } from '../decorators';
import { ClassType, CrudFindManyType } from '../types';
import {
  getAddRelationApiName,
  getFindRelationApiName,
  getRemoveRelationApiName,
  getSetRelationApiName,
} from '../utils';

export function createMicroserviceRelationController<Entity>(
  EntityClass: ClassType<Entity>,
  ProviderClass: ClassType<any>,
  relation: AutoRelationMetadata<any>,
  BaseClass: ClassType<any> = class {},
): ClassType<any> {
  const entityName = EntityClass.name;
  const providerToken = Symbol(`${entityName}Service`);
  const sourceEntityName = relation.entity().name;

  const removeRelationApiName = getRemoveRelationApiName(
    relation.name,
    sourceEntityName,
  );
  const findRelationApiName = getFindRelationApiName(
    relation.name,
    sourceEntityName,
  );
  const setRelationApiName = getSetRelationApiName(
    relation.name,
    sourceEntityName,
  );
  const addRelationApiName = getAddRelationApiName(
    relation.name,
    sourceEntityName,
  );

  @Controller()
  class MicroserviceRelationController extends BaseClass {
    [key: string]: any;

    @Inject(ProviderClass)
    readonly [providerToken]: any;

    @MessagePattern({
      cmd: findRelationApiName,
    })
    [findRelationApiName](
      @Payload('relationName') relationName: string,
      @Payload('entityIds') entityIds: string[] | number[],
      @Payload('options') options: CrudFindManyType<any>,
    ) {
      return this[providerToken].findRelation(
        relationName,
        entityIds,
        options,
        !relation.owner && sourceEntityName,
      );
    }
  }

  if (['one-to-one', 'many-to-one'].includes(relation.type)) {
    @Controller()
    class MicroserviceRelationControllerExtended extends MicroserviceRelationController {
      @MessagePattern({
        cmd: setRelationApiName,
      })
      [setRelationApiName](
        @Payload('relationName') relationName: string,
        @Payload('entityId') entityId: string | number,
        @Payload('relatedId') relatedId?: string | number,
      ) {
        return this[providerToken].setRelation(
          relationName,
          entityId,
          relatedId,
          !relation.owner && sourceEntityName,
        );
      }
    }

    return MicroserviceRelationControllerExtended;
  }

  if (['one-to-many', 'many-to-many'].includes(relation.type)) {
    @Controller()
    class MicroserviceRelationControllerExtended extends MicroserviceRelationController {
      @MessagePattern({
        cmd: addRelationApiName,
      })
      [addRelationApiName](
        @Payload('relationName') relationName: string,
        @Payload('entityId') entityId: string | number,
        @Payload('relatedId') relatedId: string | number,
      ) {
        return this[providerToken].addRelation(
          relationName,
          entityId,
          relatedId,
          !relation.owner && sourceEntityName,
        );
      }

      @MessagePattern({
        cmd: removeRelationApiName,
      })
      [removeRelationApiName](
        @Payload('relationName') relationName: string,
        @Payload('entityId') entityId: string | number,
        @Payload('relatedId') relatedId: string | number,
      ) {
        return this[providerToken].removeRelation(
          relationName,
          entityId,
          relatedId,
          !relation.owner && sourceEntityName,
        );
      }
    }

    return MicroserviceRelationControllerExtended;
  }

  return MicroserviceRelationController;
}

export function createMicroserviceRelationControllers<Entity>(
  EntityClass: ClassType<Entity>,
  ProviderClass: ClassType<any>,
  relations: AutoRelationMetadata<any>[],
  BaseClass: ClassType<any> = class {},
): ClassType<any> {
  return relations.reduce(
    (
      Extended: ClassType<any>,
      relation: AutoRelationMetadata<any>,
    ): ClassType<any> => {
      return createMicroserviceRelationController(
        EntityClass,
        ProviderClass,
        relation,
        Extended,
      );
    },
    BaseClass,
  );
}
