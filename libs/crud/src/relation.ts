import { ClassConstructor } from './types';

export const ONE_MANY_RELATION_WATERMARK = '__oneManyRelation__';

export interface OneManyRelationOptions<Entity> {
  RelatedEntityClass: ClassConstructor<Entity>;
  RelatedDtoClass: ClassConstructor<Entity>;
  relationName: string;
  inverseRelation: (...params: any[]) => any;
}

export function OneManyRelation<Entity>(
  RelatedEntityClass: ClassConstructor<Entity>,
  RelatedDtoClass: ClassConstructor<Entity>,
  relationName: string, // TODO: Refactory this
  inverseRelation: (...params: any[]) => any,
): ClassDecorator {
  return (target) => {
    const oneManyRelations: OneManyRelationOptions<Entity>[] =
      Reflect.getMetadata(ONE_MANY_RELATION_WATERMARK, target) || [];
    oneManyRelations.push({
      RelatedEntityClass,
      RelatedDtoClass,
      relationName,
      inverseRelation,
    });
    Reflect.defineMetadata(
      ONE_MANY_RELATION_WATERMARK,
      oneManyRelations,
      target,
    );
  };
}
