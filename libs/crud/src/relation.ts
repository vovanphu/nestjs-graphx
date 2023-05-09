import { ClassType } from './types';

export const ONE_MANY_RELATION_WATERMARK = '__oneManyRelation__';

export interface OneManyRelationOptions<Entity, Dto> {
  RelatedEntityClass: ClassType<Entity>;
  RelatedDtoClass: ClassType<Dto>;
  relationName: string;
}

export function OneManyRelation<Entity, Dto>(
  RelatedEntityClass: ClassType<Entity>,
  RelatedDtoClass: ClassType<Dto>,
  relationName: string, // TODO: Refactory this
): ClassDecorator {
  return (target) => {
    const oneManyRelations: OneManyRelationOptions<Entity, Dto>[] =
      Reflect.getMetadata(ONE_MANY_RELATION_WATERMARK, target) || [];
    oneManyRelations.push({
      RelatedEntityClass,
      RelatedDtoClass,
      relationName,
    });
    Reflect.defineMetadata(
      ONE_MANY_RELATION_WATERMARK,
      oneManyRelations,
      target,
    );
  };
}
